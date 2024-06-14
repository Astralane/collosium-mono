use std::future::{ready, Ready};
use std::rc::Rc;
use actix_web::{dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform}, Error, HttpResponse};
use actix_web::body::{EitherBody, BoxBody};
use futures_util::future::LocalBoxFuture;
use reqwest;

pub struct ApiKeyMiddleware;

impl<S, B> Transform<S, ServiceRequest> for ApiKeyMiddleware
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<EitherBody<B, BoxBody>>;
    type Error = Error;
    type InitError = ();
    type Transform = ApiKeyMiddlewareService<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(ApiKeyMiddlewareService {
            service: Rc::new(service),
        }))
    }
}

pub struct ApiKeyMiddlewareService<S> {
    service: Rc<S>,
}

impl<S, B> Service<ServiceRequest> for ApiKeyMiddlewareService<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<EitherBody<B, BoxBody>>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {        
        let api_key = req.headers().get("X-API-Key").and_then(|header| header.to_str().ok().map(String::from));
        let service = Rc::clone(&self.service);
        let (http_req, payload) = req.into_parts();

        Box::pin(async move {
            if let Some(api_key) = api_key {
                let api_key_valid = check_api_key(&api_key).await;
                if api_key_valid {
                    let req = ServiceRequest::from_parts(http_req, payload);
                    let res = service.call(req).await?;
                    Ok(res.map_into_left_body())
                } else {
                    let http_res = HttpResponse::Unauthorized().json("Invalid API key").map_into_boxed_body();
                    let res = ServiceResponse::new(http_req, http_res).map_into_right_body();
                    Ok(res)
                }
            } else {
                let http_res = HttpResponse::Unauthorized().json("Missing API key").map_into_boxed_body();
                let res = ServiceResponse::new(http_req, http_res).map_into_right_body();
                Ok(res)
            }
        })
    }
}

async fn check_api_key(api_key: &str) -> bool {
    let url = format!("http://localhost:3001/keys/{}", api_key);
    let client = reqwest::Client::new();
    match client.get(&url).send().await {
        Ok(response) => {
            let status = response.status();
            status == 200
        },
        Err(e) => {
            println!("Error checking API key: {}", e);
            false
        },
    }
}

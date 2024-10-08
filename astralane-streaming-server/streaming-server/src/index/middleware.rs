use std::future::{ready, Ready};
use std::rc::Rc;
use actix_web::HttpMessage;
use actix_web::{dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform}, Error, HttpResponse};
use actix_web::body::{EitherBody, BoxBody};
use futures_util::future::LocalBoxFuture;
use reqwest;

#[derive(Clone)]
pub struct ApiKeyMiddleware {
    pub admin_server_url: String,
}

impl ApiKeyMiddleware {
    pub(crate) fn new(admin_server_url: &str) -> Self {
        ApiKeyMiddleware {
            admin_server_url: String::from(admin_server_url)
        }
    }
}

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
        ready(Ok(ApiKeyMiddlewareService::new (Rc::new(service), &self.admin_server_url)))
    }
}

pub struct ApiKeyMiddlewareService<S> {
    service: Rc<S>,
    admin_server_url: String,
}

impl<S> ApiKeyMiddlewareService<S> {
    pub(crate) fn new(service: Rc<S>, admin_server_url: &str) -> Self {
        ApiKeyMiddlewareService {
            service: service.clone(),
            admin_server_url: String::from(admin_server_url)
        }
    }
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
        let api_key = req.headers().get("x-api-key").and_then(|header| header.to_str().ok().map(String::from));
        let server_url = self.admin_server_url.clone();
        let service = Rc::clone(&self.service);
        let (http_req, payload) = req.into_parts();

        Box::pin(async move {
            if let Some(api_key) = api_key {
                let api_key_valid = check_api_key(&server_url, &api_key).await;
                if api_key_valid {
                    let req = ServiceRequest::from_parts(http_req, payload);
                    req.extensions_mut().insert(api_key);
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

async fn check_api_key(admin_server_url: &str, api_key: &str) -> bool {
    let url = format!("{}/keys/{}", admin_server_url, api_key);
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

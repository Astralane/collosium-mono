FROM golang:bookworm as build
WORKDIR /build
COPY . .
RUN apt update
RUN apt install -y --no-install-recommends make unzip

ENV PROTOC_ZIP=protoc-25.1-linux-x86_64.zip
RUN curl -OL https://github.com/protocolbuffers/protobuf/releases/download/v25.1/${PROTOC_ZIP}
RUN unzip -o ${PROTOC_ZIP} -d ./proto 
RUN chmod 755 -R ./proto/bin
ENV BASE=/usr
RUN cp ./proto/bin/protoc ${BASE}/bin/
RUN cp -R ./proto/include/* ${BASE}/include/

RUN make proto
RUN go mod tidy
RUN go build -o main main.go

FROM golang:bookworm
COPY --from=build /build/main .
CMD ["./main"]

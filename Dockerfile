FROM golang:alpine
WORKDIR /build
COPY . .
RUn go mod tidy
RUN go build -o main main.go
CMD ["./main"]

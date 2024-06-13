FROM golang:alpine
WORKDIR /build
COPY . .
RUN go mod tidy
RUN go build -o main main.go
CMD ["./main"]

FROM rust:1.78 as build

RUN USER=root cargo new streaming-server
WORKDIR /streaming-server

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        libclang-dev protobuf-compiler libssl-dev libudev-dev pkg-config zlib1g-dev llvm clang cmake make libprotobuf-dev

# copy over your manifests
COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml
COPY ./jito-protos/Cargo.toml ./jito-protos/Cargo.toml
COPY ./jito-protos/src/dummy.rs ./jito-protos/src/dummy.rs
COPY ./streaming-server/Cargo.toml ./streaming-server/Cargo.toml
COPY ./streaming-server/src/dummy.rs ./streaming-server/src/dummy.rs

RUN cargo build --release

COPY ./jito-protos ./jito-protos

RUN cargo build --release

COPY ./streaming-server ./streaming-server

RUN cargo build --release

FROM rust:1.78

# copy the build artifact from the build stage
COPY --from=build /streaming-server/target/release/astraline-streaming-server .

# set the startup command to run your binary
CMD ["./astraline-streaming-server"]
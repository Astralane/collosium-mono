run:
	@go run main.go

build:
	@go build main.go

proto:
	@go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
	@rm -rf protos-out
	@mkdir protos-out
	@protoc --proto_path ./protos \
		--go_out=. \
		--go_opt=Mgeyser.proto=./protos-out \
		--go_opt=Mconfirmed_block.proto=./protos-out \
		./protos/confirmed_block.proto \
		./protos/geyser.proto \



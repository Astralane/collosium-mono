// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.4.0
// - protoc             v5.27.1
// source: old-faithful.proto

package old_faithful_grpc

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.62.0 or later.
const _ = grpc.SupportPackageIsVersion8

const (
	OldFaithful_GetVersion_FullMethodName     = "/OldFaithful.OldFaithful/GetVersion"
	OldFaithful_GetBlock_FullMethodName       = "/OldFaithful.OldFaithful/GetBlock"
	OldFaithful_GetTransaction_FullMethodName = "/OldFaithful.OldFaithful/GetTransaction"
	OldFaithful_Get_FullMethodName            = "/OldFaithful.OldFaithful/Get"
)

// OldFaithfulClient is the client API for OldFaithful service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type OldFaithfulClient interface {
	GetVersion(ctx context.Context, in *VersionRequest, opts ...grpc.CallOption) (*VersionResponse, error)
	GetBlock(ctx context.Context, in *BlockRequest, opts ...grpc.CallOption) (*BlockResponse, error)
	GetTransaction(ctx context.Context, in *TransactionRequest, opts ...grpc.CallOption) (*TransactionResponse, error)
	Get(ctx context.Context, opts ...grpc.CallOption) (OldFaithful_GetClient, error)
}

type oldFaithfulClient struct {
	cc grpc.ClientConnInterface
}

func NewOldFaithfulClient(cc grpc.ClientConnInterface) OldFaithfulClient {
	return &oldFaithfulClient{cc}
}

func (c *oldFaithfulClient) GetVersion(ctx context.Context, in *VersionRequest, opts ...grpc.CallOption) (*VersionResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(VersionResponse)
	err := c.cc.Invoke(ctx, OldFaithful_GetVersion_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *oldFaithfulClient) GetBlock(ctx context.Context, in *BlockRequest, opts ...grpc.CallOption) (*BlockResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(BlockResponse)
	err := c.cc.Invoke(ctx, OldFaithful_GetBlock_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *oldFaithfulClient) GetTransaction(ctx context.Context, in *TransactionRequest, opts ...grpc.CallOption) (*TransactionResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(TransactionResponse)
	err := c.cc.Invoke(ctx, OldFaithful_GetTransaction_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *oldFaithfulClient) Get(ctx context.Context, opts ...grpc.CallOption) (OldFaithful_GetClient, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	stream, err := c.cc.NewStream(ctx, &OldFaithful_ServiceDesc.Streams[0], OldFaithful_Get_FullMethodName, cOpts...)
	if err != nil {
		return nil, err
	}
	x := &oldFaithfulGetClient{ClientStream: stream}
	return x, nil
}

type OldFaithful_GetClient interface {
	Send(*GetRequest) error
	Recv() (*GetResponse, error)
	grpc.ClientStream
}

type oldFaithfulGetClient struct {
	grpc.ClientStream
}

func (x *oldFaithfulGetClient) Send(m *GetRequest) error {
	return x.ClientStream.SendMsg(m)
}

func (x *oldFaithfulGetClient) Recv() (*GetResponse, error) {
	m := new(GetResponse)
	if err := x.ClientStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

// OldFaithfulServer is the server API for OldFaithful service.
// All implementations must embed UnimplementedOldFaithfulServer
// for forward compatibility
type OldFaithfulServer interface {
	GetVersion(context.Context, *VersionRequest) (*VersionResponse, error)
	GetBlock(context.Context, *BlockRequest) (*BlockResponse, error)
	GetTransaction(context.Context, *TransactionRequest) (*TransactionResponse, error)
	Get(OldFaithful_GetServer) error
	mustEmbedUnimplementedOldFaithfulServer()
}

// UnimplementedOldFaithfulServer must be embedded to have forward compatible implementations.
type UnimplementedOldFaithfulServer struct {
}

func (UnimplementedOldFaithfulServer) GetVersion(context.Context, *VersionRequest) (*VersionResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetVersion not implemented")
}
func (UnimplementedOldFaithfulServer) GetBlock(context.Context, *BlockRequest) (*BlockResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetBlock not implemented")
}
func (UnimplementedOldFaithfulServer) GetTransaction(context.Context, *TransactionRequest) (*TransactionResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetTransaction not implemented")
}
func (UnimplementedOldFaithfulServer) Get(OldFaithful_GetServer) error {
	return status.Errorf(codes.Unimplemented, "method Get not implemented")
}
func (UnimplementedOldFaithfulServer) mustEmbedUnimplementedOldFaithfulServer() {}

// UnsafeOldFaithfulServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to OldFaithfulServer will
// result in compilation errors.
type UnsafeOldFaithfulServer interface {
	mustEmbedUnimplementedOldFaithfulServer()
}

func RegisterOldFaithfulServer(s grpc.ServiceRegistrar, srv OldFaithfulServer) {
	s.RegisterService(&OldFaithful_ServiceDesc, srv)
}

func _OldFaithful_GetVersion_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(VersionRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(OldFaithfulServer).GetVersion(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: OldFaithful_GetVersion_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(OldFaithfulServer).GetVersion(ctx, req.(*VersionRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _OldFaithful_GetBlock_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(BlockRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(OldFaithfulServer).GetBlock(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: OldFaithful_GetBlock_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(OldFaithfulServer).GetBlock(ctx, req.(*BlockRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _OldFaithful_GetTransaction_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(TransactionRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(OldFaithfulServer).GetTransaction(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: OldFaithful_GetTransaction_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(OldFaithfulServer).GetTransaction(ctx, req.(*TransactionRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _OldFaithful_Get_Handler(srv interface{}, stream grpc.ServerStream) error {
	return srv.(OldFaithfulServer).Get(&oldFaithfulGetServer{ServerStream: stream})
}

type OldFaithful_GetServer interface {
	Send(*GetResponse) error
	Recv() (*GetRequest, error)
	grpc.ServerStream
}

type oldFaithfulGetServer struct {
	grpc.ServerStream
}

func (x *oldFaithfulGetServer) Send(m *GetResponse) error {
	return x.ServerStream.SendMsg(m)
}

func (x *oldFaithfulGetServer) Recv() (*GetRequest, error) {
	m := new(GetRequest)
	if err := x.ServerStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

// OldFaithful_ServiceDesc is the grpc.ServiceDesc for OldFaithful service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var OldFaithful_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "OldFaithful.OldFaithful",
	HandlerType: (*OldFaithfulServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetVersion",
			Handler:    _OldFaithful_GetVersion_Handler,
		},
		{
			MethodName: "GetBlock",
			Handler:    _OldFaithful_GetBlock_Handler,
		},
		{
			MethodName: "GetTransaction",
			Handler:    _OldFaithful_GetTransaction_Handler,
		},
	},
	Streams: []grpc.StreamDesc{
		{
			StreamName:    "Get",
			Handler:       _OldFaithful_Get_Handler,
			ServerStreams: true,
			ClientStreams: true,
		},
	},
	Metadata: "old-faithful.proto",
}

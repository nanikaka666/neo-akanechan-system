// GENERATED CODE -- DO NOT EDIT!

// package: youtube.api.v3
// file: proto/stream_list.proto

import * as proto_stream_list_pb from "../proto/stream_list_pb";
import * as grpc from "@grpc/grpc-js";

interface IV3DataLiveChatMessageServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  streamList: grpc.MethodDefinition<proto_stream_list_pb.LiveChatMessageListRequest, proto_stream_list_pb.LiveChatMessageListResponse>;
}

export const V3DataLiveChatMessageServiceService: IV3DataLiveChatMessageServiceService;

export interface IV3DataLiveChatMessageServiceServer extends grpc.UntypedServiceImplementation {
  streamList: grpc.handleServerStreamingCall<proto_stream_list_pb.LiveChatMessageListRequest, proto_stream_list_pb.LiveChatMessageListResponse>;
}

export class V3DataLiveChatMessageServiceClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  streamList(argument: proto_stream_list_pb.LiveChatMessageListRequest, metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientReadableStream<proto_stream_list_pb.LiveChatMessageListResponse>;
  streamList(argument: proto_stream_list_pb.LiveChatMessageListRequest, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientReadableStream<proto_stream_list_pb.LiveChatMessageListResponse>;
}

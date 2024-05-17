// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.174.0
//   protoc               v4.25.3
// source: bundle.proto

/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Packet } from "./packet";
import { Header } from "./shared";

export const protobufPackage = "bundle";

export interface Bundle {
  header: Header | undefined;
  packets: Packet[];
}

export interface BundleUuid {
  bundle: Bundle | undefined;
  uuid: string;
}

function createBaseBundle(): Bundle {
  return { header: undefined, packets: [] };
}

export const Bundle = {
  encode(message: Bundle, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.header !== undefined) {
      Header.encode(message.header, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.packets) {
      Packet.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Bundle {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBundle();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          if (tag !== 18) {
            break;
          }

          message.header = Header.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.packets.push(Packet.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Bundle {
    return {
      header: isSet(object.header) ? Header.fromJSON(object.header) : undefined,
      packets: globalThis.Array.isArray(object?.packets) ? object.packets.map((e: any) => Packet.fromJSON(e)) : [],
    };
  },

  toJSON(message: Bundle): unknown {
    const obj: any = {};
    if (message.header !== undefined) {
      obj.header = Header.toJSON(message.header);
    }
    if (message.packets?.length) {
      obj.packets = message.packets.map((e) => Packet.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Bundle>, I>>(base?: I): Bundle {
    return Bundle.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Bundle>, I>>(object: I): Bundle {
    const message = createBaseBundle();
    message.header = (object.header !== undefined && object.header !== null)
      ? Header.fromPartial(object.header)
      : undefined;
    message.packets = object.packets?.map((e) => Packet.fromPartial(e)) || [];
    return message;
  },
};

function createBaseBundleUuid(): BundleUuid {
  return { bundle: undefined, uuid: "" };
}

export const BundleUuid = {
  encode(message: BundleUuid, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.bundle !== undefined) {
      Bundle.encode(message.bundle, writer.uint32(10).fork()).ldelim();
    }
    if (message.uuid !== "") {
      writer.uint32(18).string(message.uuid);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BundleUuid {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBundleUuid();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.bundle = Bundle.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.uuid = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BundleUuid {
    return {
      bundle: isSet(object.bundle) ? Bundle.fromJSON(object.bundle) : undefined,
      uuid: isSet(object.uuid) ? globalThis.String(object.uuid) : "",
    };
  },

  toJSON(message: BundleUuid): unknown {
    const obj: any = {};
    if (message.bundle !== undefined) {
      obj.bundle = Bundle.toJSON(message.bundle);
    }
    if (message.uuid !== "") {
      obj.uuid = message.uuid;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BundleUuid>, I>>(base?: I): BundleUuid {
    return BundleUuid.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BundleUuid>, I>>(object: I): BundleUuid {
    const message = createBaseBundleUuid();
    message.bundle = (object.bundle !== undefined && object.bundle !== null)
      ? Bundle.fromPartial(object.bundle)
      : undefined;
    message.uuid = object.uuid ?? "";
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

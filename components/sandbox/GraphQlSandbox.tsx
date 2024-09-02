"use client";
import React, { FC } from "react";
import { ApolloSandbox } from "@apollo/sandbox/react";
type TGPLSandboxProps = {
  endpoint: string;
};
const GraphQlSandbox: FC<TGPLSandboxProps> = ({ endpoint }) => {
  console.log(endpoint);
  return (
    <div className="h-full">
      <ApolloSandbox
        initialEndpoint={endpoint}
        handleRequest={(endpointUrl, options) => {
          return fetch(endpointUrl, {
            ...options,
            headers: {
              ...options.headers,
              "x-api-key": `b2f9d58511806a5a142e99fe42c44c0eb91221d04227e28145e818a110c5e64f`,
            },
          });
        }}
        endpointIsEditable={false}
        className="h-full"
      />
    </div>
  );
};

export default GraphQlSandbox;

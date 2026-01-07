NODE_BIN="./node_modules/.bin"
OUT_DIR="./src/main/grpc/generated"

.PHONY: gen
gen:
	rm -rf ${OUT_DIR} && mkdir -p ${OUT_DIR}
	${NODE_BIN}/grpc_tools_node_protoc \
	--plugin="protoc-gen-ts=${NODE_BIN}/protoc-gen-ts" \
	--plugin=protoc-gen-grpc=${NODE_BIN}/grpc_tools_node_protoc_plugin \
	--js_out="import_style=commonjs,binary:${OUT_DIR}" \
	--ts_out="service=grpc-node,mode=grpc-js:${OUT_DIR}" \
	--grpc_out="grpc_js:${OUT_DIR}" \
	./proto/*.proto
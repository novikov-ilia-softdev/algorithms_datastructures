#!/usr/bin/env bash

find . -name "*.proto" | while read proto_file ; do
	file_name=`echo $proto_file | awk '{ print substr($0, 3, length($0) - 8);}'`
    file_name=$file_name".desc"
	protoc --descriptor_set_out=$file_name --include_imports $proto_file
	echo "Refresh $proto_file > $file_name"
done

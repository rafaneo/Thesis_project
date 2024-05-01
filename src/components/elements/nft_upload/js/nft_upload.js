import React, { useEffect, useState, useMemo } from 'react';
import { useDropzone, ErrorCode } from 'react-dropzone';

import styled from 'styled-components';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};
const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
};

const thumb = {
  display: 'flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
};

const thumbInner = {
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  overflow: 'hidden',
};

const focusedStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%',
};

function NFTUpload(props) {
  const [files, setFiles] = useState([]);
  const [fileErrorMsg, setFileErrorMsg] = useState('');
  const { errors } = props;
  const acceptedExtensions = ['.png', '.jpg', '.jpeg'];

  useEffect(() => {
    props.setFile(files.map(file => file));
  }, [files]);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        'image/png': ['.png'],
        'image/jpg': ['.jpg'],
        'image/jpeg': ['.jpeg'],
      },
      maxFiles: 1,
      validator: file => {
        if (!acceptedExtensions.includes(file.name.slice(-4))) {
          setFileErrorMsg('Only *.jpeg, *.jpg, *.png images will be accepted');
          return ErrorCode.FILE_TYPE_NOT_SUPPORTED;
        } else if (files.length > 1) {
          setFileErrorMsg('Only one file can be uploaded');
          return ErrorCode.MAX_FILE_COUNT_EXCEEDED;
        } else if (file.size > 1000000) {
          setFileErrorMsg('File size should be less than 1MB');
          return ErrorCode.MAX_FILE_SIZE_EXCEEDED;
        }

        return ErrorCode.NO_ERROR;
      },

      onDrop: acceptedFiles => {
        setFiles(
          acceptedFiles.map(file =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
          ),
        );
      },
    });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );
  const file_name = files.map(file => (
    <div>
      <p>File name</p>
      <li className='indent-5' key={file.path}>
        {file.path}
      </li>
    </div>
  ));

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <section className='container'>
      <div {...getRootProps({ style })}>
        <input
          {...getInputProps()}
          name='file'
          type='file'
          className='form-control'
        />

        <p>Drag 'n' drop an image file, or click to select an image</p>
        <em>(Only *.jpeg, *.jpg, *.png images will be accepted)</em>
      </div>
      {fileErrorMsg && <p className='text-red-600'>{fileErrorMsg}</p>}
      <div className='intent-3 mt-3'></div>
      <aside>{file_name}</aside>
      <aside style={thumbsContainer}>{thumbs}</aside>
    </section>
  );
}
export default NFTUpload;

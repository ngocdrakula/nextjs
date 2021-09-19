import React, { Component } from "react";
import dynamic from "next/dynamic";

const EditorCustom = dynamic(() => import('./EditorCustom'), { ssr: false });

const TextEditor = (props) => <EditorCustom {...props} />

export default TextEditor;

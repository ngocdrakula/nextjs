import React, { Component } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';


class EditorCustom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty()
        }
        this.randomKey = "editor-" + Math.floor(Math.random() * 100000)
    }
    componentDidMount() {
        const { value } = this.props;
        const contentBlock = value && htmlToDraft(value);
        if (contentBlock) {
            console.log(value)
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({ editorState })
        }
        else {
            this.setState({ editorState: EditorState.createEmpty() })
        }
    }

    componentDidUpdate(prevProps) {
        const { value, key } = this.props;
        if (prevProps.key != key) {
            const contentBlock = value && htmlToDraft(value);
            if (contentBlock) {
                console.log(value)
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.setState({ editorState })
            }
            else {
                this.setState({ editorState: EditorState.createEmpty() })
            }
        }
    }
    onEditorStateChange = (editorState) => {
        const { onChange, name } = this.props;
        const value = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.setState({ editorState });
        onChange({ target: { name, value } });
    };
    render() {
        const { editorState } = this.state
        const { className, placeholder, key, readOnly } = this.props;
        const editorStyle = {};
        if (readOnly) editorStyle.backgroundColor = '#eee';
        return (
            <Editor
                key={key || this.randomKey}
                editorState={editorState}
                wrapperClassName="wrapperClassName"
                toolbarStyle={{ borderColor: '#d2d6de', display: readOnly ? 'none' : 'flex' }}
                editorStyle={editorStyle}
                readOnly={readOnly}
                placeholder={placeholder}
                editorClassName={className}
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link']
                }}
            />
        );
    }
}

export default EditorCustom;

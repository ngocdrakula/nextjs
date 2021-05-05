import React, { useState, useRef } from 'react';
import { Button, Overlay, Popover } from "react-bootstrap";


function PopupConfirm({ handleAccept, handleCancel, ButtonClick, title, accept, ok, cancel, className, style }) {
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);

    const handleClick = (event) => {
        setShow(!show);
        setTarget(event.target);
    };
    const handleEnter = () => {
        if (typeof handleAccept === 'function') handleAccept();
        setShow(!show);
    }
    const handleExit = () => {
        if (typeof handleCancel === 'function') handleCancel();
        setShow(!show);
    }

    return (
        <div ref={ref} className={className} style={style}>
            {ButtonClick ?
                <ButtonClick handleClick={handleClick} />
                :
                <Button onClick={handleClick}>{title}</Button>
            }
            <Overlay
                show={show}
                target={target}
                placement="bottom"
                container={ref.current}
                containerPadding={20}
                rootClose={true}
                rootCloseEvent='click'
                onHide={handleExit}
            >
                <Popover id="popover-contained"style={{minWidth: 230}}>
                    <Popover.Title as="h3">{accept}</Popover.Title>
                    <Popover.Content style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                            type="button"
                            onClick={handleEnter}
                            style={{
                                padding: '3px 10px',
                                fontSize: 14,
                                borderRadius: 5,
                                border: '1px solid #007bff',
                                background: '#007bff',
                                color: '#FFF',
                                marginLeft: 10
                            }}
                        >{ok}</button>
                        <button
                            type="button"
                            onClick={handleExit}
                            style={{
                                padding: '3px 10px',
                                fontSize: 14,
                                borderRadius: 5,
                                border: '1px solid #999',
                                background: '#f1f1f1',
                                color: '#333',
                                marginRight: 10
                            }}
                        >{cancel}</button>
                    </Popover.Content>
                </Popover>
            </Overlay>
        </div>
    );
}
export default PopupConfirm
import React, { Component } from 'react'

export default class Page extends Component {
    handleSelect = (e, page, enable) => {
        e.preventDefault();
        if (enable) this.props.gotoPage(page);

    }
    render() {
        const { page, totalPage, numberButton = 5 } = this.props
        return (
            <div className="d-flex justify-content-center">
                <ul className="pagination mt-3 mb-0">
                    {page > 0 ?
                        <li className="page-item">
                            <a href="#" onClick={e => this.handleSelect(e, 0, true)} className="page-link">«</a>
                        </li>
                        : ""}
                    {new Array(numberButton).fill(0).map((item, index) => {
                        const pageIndex = page + index - (numberButton - 1) / 2;
                        if (pageIndex < 0 || pageIndex >= totalPage) return null
                        return (
                            <li key={index} className={"page-item" + (pageIndex === page ? " active" : "")}>
                                <a href="#" onClick={e => this.handleSelect(e, pageIndex, pageIndex !== page)} className="page-link">
                                    {pageIndex + 1}
                                </a>
                            </li>
                        );
                    })}
                    {page < totalPage - 1 ?
                        <li className="page-item">
                            <a href="#" onClick={e => this.handleSelect(e, totalPage - 1, true)} className="page-link">»</a>
                        </li>
                        : ""}
                </ul >
            </div>
        )
    }
}

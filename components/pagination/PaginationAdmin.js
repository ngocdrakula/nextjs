import React, { Component } from 'react';
import langConfig from '../../lang.config';
import { translate } from '../../utils/language';

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleSelect = (e, page, enable) => {
        e.preventDefault();
        if (enable) this.props.gotoPage(page);
    }
    render() {
        const { currentPage, total, pageSize, numberButton = 5 } = this.props;
        const totalPage = Math.ceil(total / pageSize) || 1;
        return (
            <>
                <div className="dataTables_info" id="DataTables_Table_1_info">{pageSize * currentPage + 1} to {pageSize * (currentPage + 1)} {translate(langConfig.app.ofTotal)} {total} {translate(langConfig.app.item)}</div>
                <div className="dataTables_paginate paging_simple_numbers" id="DataTables_Table_0_paginate">
                    <ul className="pagination">
                        <li
                            className={"paginate_button previous" + (currentPage > 0 ? "" : " disabled")}
                        >
                            <a href="#" onClick={e => this.handleSelect(e, currentPage - 1, currentPage > 0)}>
                                <i className="fa fa-hand-o-left" />
                            </a>
                        </li>
                        {currentPage > 2 && totalPage > 5 ? <li className="paginate_button"><a href="#" onClick={e => this.handleSelect(e, 0, true)}>1</a></li> : ""}
                        {currentPage > 3 && totalPage > 6 ? <li className="paginate_button"><a href="#" onClick={e => this.handleSelect(e, 1, true)}  >...</a></li> : ""}
                        {(new Array(5)).fill(0).map((item, index) => {
                            let pageIndex = currentPage + index - (numberButton - 1) / 2;
                            if (currentPage < 2) pageIndex += 1;
                            else if (currentPage > totalPage - 3) pageIndex -= 1;
                            if (currentPage < 1) pageIndex += 1;
                            else if (currentPage > totalPage - 2) pageIndex -= 1;
                            if (pageIndex < 0 || pageIndex >= totalPage) return null
                            return (
                                <li key={index} className={"paginate_button" + (pageIndex === currentPage ? " active" : "")}>
                                    <a href="#" onClick={e => this.handleSelect(e, pageIndex, true)} className={currentPage === pageIndex ? "active" : ""}>
                                        {pageIndex + 1}
                                    </a>
                                </li>
                            );
                        })}
                        {currentPage < totalPage - 4 && totalPage > 6 ? <li className="paginate_button"><a href="#" onClick={e => this.handleSelect(e, totalPage - 2, true)}  >...</a></li> : ""}
                        {currentPage < totalPage - 3 && totalPage > 5 ? <li className="paginate_button"><a href="#" onClick={e => this.handleSelect(e, totalPage - 1, true)} >{totalPage}</a></li> : ""}
                        <li
                            className={"paginate_button next" + (currentPage < totalPage - 1 ? "" : " disabled")}
                        >
                            <a href="#" onClick={e => this.handleSelect(e, currentPage + 1, currentPage < totalPage - 1)}>
                                <i className="fa fa-hand-o-right" />
                            </a>
                        </li>
                    </ul>
                </div>
            </>
        )
    }
}

export default Pagination;

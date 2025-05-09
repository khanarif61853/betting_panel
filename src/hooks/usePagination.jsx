import React from 'react'


export const usePagination = () => {
    const [page, setPage] = React.useState(0);
    const [limit, setLimit] = React.useState(25);
    const [total, setTotal] = React.useState(25);

    const changePage = (value) => {
        setPage(value);
    };
    const changeLimit = (event, value) => {
        setLimit(event);
        // setPage(0);
    };

    const changeTotal = (value) => {
        setTotal(value)
    }
    return {
        page,
        limit,
        total,
        changePage,
        changeLimit,
        changeTotal,
    }


}

import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { Table, Input, message, Image } from 'antd';
import axios from 'axios';
import {URL} from "../urls";

const { Search } = Input;
const columns = [
    {
        title: "#",
        dataIndex: "id",
        width: "40px",
    },
    {
        title: "Title",
        dataIndex: "title",
        width: "200px",
    },
    {
        title: "Price",
        dataIndex: "price",
        render: (price) => parseFloat(price).toFixed(2),
        width: "80px"
    },
    {
        title: "Description",
        dataIndex: "description",
    },
    {
        title: "Category",
        dataIndex: "category",
        width: "120px"
    },
    {
        title: "Sold",
        dataIndex: "sold",
        render: (sold) => sold ? "Yes" : "No",
        width: "50px"
    },
    {
        title: "Date",
        dataIndex: "dateOfSale",
        render: (date) => moment(date).format("DD MMM YYYY"),
        width: "100px"
    },
    {
        title: "Image",
        dataIndex: "image",
        render: (url) => <Image src={url} alt="Product Image" />,
        width: "80px"
    }
];


function Transactions({ month, monthText }) {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10
        }
    });

    const getDataFromLocal = (month) => {
        const data = localStorage.getItem('roxiler-transaction' + month);

        if(data == null || data.length == 0) {
            return false;
        }
        setData(JSON.parse(data));
        return true;
        
    
        // if(data != null || data.length != 0) {
        // }
        
        // return false;
    }
    
    const setDataFromLocal = () => {
        localStorage.setItem('roxiler-transaction', JSON.stringify(data));
    }


    const getData = async () => {
        try {
            
            setLoading(true);
            // const { data } = await axios.get("http://localhost:8080/api/transactions", {
                
            const { data } = await axios.get(`https://roxiler-pvpf.onrender.com/transactions`, {
                params: {
                    month,
                    page: tableParams.pagination.current,
                    limit: tableParams.pagination.pageSize,
                    search: tableParams.search
                }
            });
            console.log(data);


            setData(data.transactions);
            setDataFromLocal();

            setLoading(false);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: data.totalCount,
                }
            });
            message.success('Data loaded successfully');
        } catch (error) {
            console.log(error);
            message.error('Error loading data');
        }
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            ...tableParams,
            pagination
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    const handleSearch = (value) => {
        setTableParams({
            ...tableParams,
            search: value
        });
    }

    useEffect(() => {
        
        if(!getDataFromLocal(month)) {
            getData();
        }
        console.log(getDataFromLocal());
        
    }, [JSON.stringify(tableParams), month]);

    return (
        <>
            <Search
                placeholder="Search"
                allowClear
                onSearch={handleSearch}
                style={{
                    width: 300,
                    padding: "12px 0px"
                }}
            />

            <Table
                columns={columns}
                rowKey={(record) => record.id}
                dataSource={data}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                size='small'
                bordered
                title={() => <strong>Transactions for {monthText}</strong>}
                scroll={{ y: 540 }}
            />
        </>
    )
}

export default Transactions
"use client";
import React, { useState, useEffect } from "react";

function Order({ user }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://681f51fa72e59f922ef5e692.mockapi.io/api/orders");
                if (!res.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await res.json();
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setSubmitStatus("Failed to load orders. Please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const updateOrderStatus = async (productId, newStatus) => {
        setUpdatingId(productId);
        try {
            const orderToUpdate = orders.find(order => order.productId === productId);
            
            if (!orderToUpdate) {
                throw new Error('Order not found');
            }

            // Optimistic update
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.productId === productId 
                    ? { ...order, productStatus: newStatus } 
                    : order
                )
            );

            const response = await fetch(`https://681f51fa72e59f922ef5e692.mockapi.io/api/orders/${orderToUpdate.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...orderToUpdate,
                    productStatus: newStatus
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            setSubmitStatus(`Order ${productId} has been ${newStatus}`);
            setTimeout(() => setSubmitStatus(null), 3000);

        } catch (error) {
            console.error("Error updating order status:", error);
            setSubmitStatus(error.message || `Error updating order ${productId}`);
            
            // Revert the local change if the API call fails
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.productId === productId 
                    ? { ...order, productStatus: orderToUpdate.productStatus } 
                    : order
                )
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'delivered':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <section className="py-8 bg-[#343148FF]">
            <div className="container px-4 mx-auto">
                {/* Status message display */}
                {submitStatus && (
                    <div className={`mb-4 p-3 rounded-md ${
                        submitStatus.includes("Error") || submitStatus.includes("Failed") 
                            ? "bg-red-100 text-red-700" 
                            : "bg-green-100 text-green-700"
                    }`}>
                        {submitStatus}
                    </div>
                )}

                <div className="flex flex-wrap gap-6">
                    <div className="w-full">
                        <div className="p-4 mb-6 bg-white shadow rounded overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <th className="px-4 py-2">Product-Id</th>
                                        <th className="px-4 py-2">Quantity</th>
                                        <th className="px-4 py-2">Client-Id</th>
                                        <th className="px-4 py-2">Date</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">Delivery-Address</th>
                                        <th className="px-4 py-2">Method</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-[#D7C49EFF] shadow-md rounded-lg overflow-hidden divide-y divide-gray-400 text-sm">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="px-4 py-4 text-center">
                                                Loading orders...
                                            </td>
                                        </tr>
                                    ) : orders.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-4 py-4 text-center">
                                                No orders found
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map((order) => (
                                            <tr key={order.productId} className="hover:bg-[#343148FF] hover:text-white hover:font-bold">
                                                <td className="px-4 py-2">{order.productId}</td>
                                                <td className="px-4 py-2">{order.quantity}</td>
                                                <td className="px-4 py-2">{order.clientId}</td>
                                                <td className="px-4 py-2">{order.date}</td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.productStatus)}`}>
                                                        {order.productStatus}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">{order.deliveryAddress}</td>
                                                <td className="px-4 py-2 font-semibold">{order.deliveryMethod}</td>
                                                <td className="px-4 py-2 flex space-x-2">
                                                    {order.productStatus !== 'accepted' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.productId, 'accepted')}
                                                            disabled={updatingId === order.productId}
                                                            className={`bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs ${
                                                                updatingId === order.productId ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                        >
                                                            {updatingId === order.productId ? 'Processing...' : 'Accept'}
                                                        </button>
                                                    )}
                                                    {order.productStatus !== 'rejected' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.productId, 'rejected')}
                                                            disabled={updatingId === order.productId}
                                                            className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs ${
                                                                updatingId === order.productId ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                        >
                                                            {updatingId === order.productId ? 'Processing...' : 'Reject'}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Order;
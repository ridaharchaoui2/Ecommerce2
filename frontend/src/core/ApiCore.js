import { API_URL } from "@/config";
import queryString from "query-string";

export const getProducts = (params) => {
  // Map frontend sort values to API parameters
  if (params.sortBy) {
    switch (params.sortBy) {
      case "price_asc":
        params.sortBy = "price";
        params.order = "asc";
        break;
      case "price_desc":
        params.sortBy = "price";
        params.order = "desc";
        break;
      case "newest":
        params.sortBy = "createdAt";
        params.order = "desc";
        break;
      case "sold_desc":
        params.sortBy = "sold";
        params.order = "desc";
        break;
      default:
        delete params.sortBy;
        delete params.order;
    }
  }
  let query = queryString.stringify(params);
  return fetch(`${API_URL}/product?${query}`)
    .then((res) => res.json())
    .then((res) => res.products)
    .catch((err) => console.error(err));
};

export const getProduct = (id) => {
  return fetch(`${API_URL}/product/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => res.product)
    .catch((err) => console.error(err));
};

export const relatedProducts = (id) => {
  return fetch(`${API_URL}/product/related/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => res.products)
    .catch((err) => console.error(err));
};

export const filterProducts = (skip, limit, filters) => {
  const data = {
    skip,
    limit,
    filters,
  };
  return fetch(`${API_URL}/product/search`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => res.products)
    .catch((err) => console.error(err));
};

export const getCategories = () => {
  return fetch(`${API_URL}/category`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => res.categories)
    .catch((err) => console.error(err));
};

export const getOrders = (userId, token) => {
  return fetch(`${API_URL}/order/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => res.orders)
    .catch((err) => console.error(err));
};

export const createOrder = async (userId, token, orderData) => {
  try {
    const response = await fetch(`${API_URL}/order/create/${userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (err) {
    console.error("Create order error:", err);
    throw err;
  }
};

export const updateOrderStatus = async (orderId, userId, token, status) => {
  try {
    const response = await fetch(
      `${API_URL}/order/${orderId}/status/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, orderId }), // Ensure status is included here
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update order status");
    }

    return await response.json();
  } catch (error) {
    console.error("Update order status error:", error);
    throw error;
  }
};

export const processPayment = async (userId, token, paymentData) => {
  if (!userId || typeof userId !== "string") {
    throw new Error("Invalid user ID");
  }

  try {
    const response = await fetch(`${API_URL}/payment/stripe/${userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (err) {
    console.error("Payment processing error:", err);
    throw err;
  }
};

export const getUser = (id, token) => {
  return fetch(`${API_URL}/user/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => res.user)
    .catch((err) => console.error(err));
};

export const getUserOrders = (userId, token) => {
  return fetch(`${API_URL}/order/user/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => res.orders)
    .catch((err) => console.error(err));
};

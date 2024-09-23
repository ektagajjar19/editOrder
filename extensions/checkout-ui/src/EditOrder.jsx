import React, { useEffect, useState } from 'react';

const MyComponent = () => {
  const [csrfToken, setCsrfToken] = useState("myCsrfToken");
  const [orderId, setOrderId] = useState(null);
  const [timeMsg, setTimeMsg] = useState(null);
  const [addItemBtnHTML, setAddItemBtnHTML] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [editOrderData, setEditOrderData] = useState(null);
  const [editAddressData, setEditAddressData] = useState(null);
  const [addItemsData, setAddItemsData] = useState(null);

  useEffect(() => {
    const metaTag = document.createElement("meta");
    metaTag.name = "csrf-token";
    metaTag.content = csrfToken;
    document.head.appendChild(metaTag);

    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
    document.head.appendChild(linkElement);

    const deskURL = "https://planners-hot-months-links.trycloudflare.com/";
    const shopName = Shopify.shop;
    const element = document.querySelector(".enButtonsEO");
    const orderId = element.dataset.orderId;
    setOrderId(orderId);

    const requestData = { shop_name: shopName, orderId: orderId };
    const headers = { "Content-Type": "application/json" };
    const endpoints = [
      `${deskURL}api/get/data`,
      `${deskURL}api/get/editorderdata`,
      `${deskURL}api/get/editaddressdata`,
      `${deskURL}api/get/additemsdata`,
      `${deskURL}api/getorderstatus`,
    ];

    const fetchData = async (url, data) => {
      try {
        const response = await fetch(url, { method: "POST", headers: headers, body: JSON.stringify(data) });
        return await response.json();
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
      }
    };

    const getData = async () => {
      const results = await Promise.all(endpoints.map((url) => fetchData(url, requestData)));
      const [data, editOrderData, editAddressData, addItemsData, orderStatusData] = results;

      if (data && editOrderData && editAddressData && addItemsData && orderStatusData) {
        setOrderStatus(orderStatusData.data);
        setEditOrderData(editOrderData);
        setEditAddressData(editAddressData);
        setAddItemsData(addItemsData);

        const {
          eo_btn_title: editOrderBtnTitle,
          eo_btn_bgcolor: editOrderBtnBgColor,
          eo_btn_textcolor: editOrderBtnTextColor,
          activate_at_order_status: activateEditOrderBtn,
        } = editOrderData;

        const {
          ea_btn_title: editAddressBtnTitle,
          ea_btn_bgcolor: editAddressBtnBgColor,
          ea_btn_textcolor: editAddressBtnTextColor,
          activate_at_order_status: activateEditAddressBtn,
        } = editAddressData;

        const {
          ai_btn_title: addItemBtnTitle,
          ai_btn_bgcolor: addItemBtnBgColor,
          ai_btn_textcolor: addItemBtnTextColor,
        } = addItemsData;

        const addItemBtnHTML =
          '<div class="addItemsBtnDiv">' +
          createButton("addItemBtn", addItemBtnTitle, addItemBtnBgColor, addItemBtnTextColor, "AddItemsPopup()") +
          '</div><div class="newItems"></div>';
        setAddItemBtnHTML(addItemBtnHTML);

        if (orderStatusData.data.displayFulfillmentStatus === "UNFULFILLED") {
          if (orderStatusData.data.remainingTimeInHours >= 0 && orderStatusData.data.remainingTimeInMinutes >= 0) {
            const timeMsg =
              orderStatusData.data.remainingTimeInHours > 1
                ? `You have ${orderStatusData.data.remainingTimeInHours} hours left.`
                : `You have ${orderStatusData.data.remainingTimeInMinutes} minutes left.`;
            setTimeMsg(timeMsg);

            if (activateEditOrderBtn && activateEditAddressBtn) {
              createEditAddressDiv(editAddressBtnTitle, editAddressBtnBgColor, editAddressBtnTextColor, orderStatusData.data, timeMsg);
              createEditOrderDiv(editOrderBtnTitle, editOrderBtnBgColor, editOrderBtnTextColor, timeMsg);
            } else if (activateEditOrderBtn) {
              createEditOrderDiv(editOrderBtnTitle, editOrderBtnBgColor, editOrderBtnTextColor, timeMsg);
            } else if (activateEditAddressBtn) {
              createEditAddressDiv(editAddressBtnTitle, editAddressBtnBgColor, editAddressBtnTextColor, orderStatusData.data, timeMsg);
            }
          } else {
            const expiredDiv =
              '<div class="dynamic-div"><p class="expired">Your time limit has been expired to edit this order.</p></div>';
            insertAfter(document.createRange().createContextualFragment(expiredDiv), document.querySelector(".order-details"));
          }
        } else {
          const fulfilledDiv =
            "<div class='dynamic-div'><p class='expired'>This order is Fulfilled, now you can't edit this order.</p></div>";
          insertAfter(document.createRange().createContextualFragment(fulfilledDiv), document.querySelector(".order-details"));
        }
      } else {
        console.error("Failed to fetch all necessary data");
      }
    };

    getData();
  }, [csrfToken]);

  const createButton = (id, title, bgColor, textColor, onClick) => `
    <button id="${id}" style="background-color: ${bgColor}; color: ${textColor};" class="button-style" onClick="${onClick}">${title}</button>`;

  const createDiv = (title, message, buttonHtml, timeMsg) => `
    <div class="dynamic-div">
        <h3>${title}</h3>
        <p>${message}</p>
        ${buttonHtml}
        <p class="time-limit-message">${timeMsg}</p>
    </div>`;

  const insertAfter = (newNode, referenceNode) => {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  };

  const createEditOrderDiv = (title, bgColor, textColor, timeMsg) => {
    if (window.location.href.includes("orders")) {
      const footer = document.querySelector(".order-details");
      if (footer) {
        const buttonHtml = createButton("EditOrderPopup", title, bgColor, textColor, "loadEditOrderPopup()");
        const editOrderDiv = createDiv(title, "Take control of your Edit order with these actions", buttonHtml, timeMsg);
        insertAfter(document.createRange().createContextualFragment(editOrderDiv), footer);
      }
    }
  };

  const createEditAddressDiv = (title, bgColor, textColor, data, timeMsg) => {
    if (window.location.href.includes("orders")) {
      const footer = document.querySelector(".order-details");
      if (footer) {
        const buttonHtml = createButton(
          "EditAddressPopup",
          title,
          bgColor,
          textColor,
          `loadEditAddressPopup('${data.country}','${data.province}','${data.city}','${data.address1}','${data.address2}','${data.phone}','${data.zip}')`
        );
        const editAddressDiv = createDiv(
          title,
          "Need to change your shipping address? Click the button below to change your order's shipping address.",
          buttonHtml,
          timeMsg
        );
        insertAfter(document.createRange().createContextualFragment(editAddressDiv), footer);
      }
    }
  };

  const loadEditAddressPopup = (country, state, city, address1, address2, phone, zip) => {
    if (phone === 'null') phone = null;
    const popupContainer = document.querySelector(".enPopupmodel");
    popupContainer.innerHTML = `
      <div class="model-header">
          <h3>Edit Address</h3>
      </div>
      <form class="model-form">
          ${createPopupForm(
            [
              { id: "address1", placeholder: "Address 1", value: address1 },
              { id: "address2", placeholder: "Address 2", value: address2 },
              { id: "city", placeholder: "City", value: city },
              { id: "pincode", placeholder: "Pin code", value: zip },
              { id: "phone", placeholder: "Phone", value: phone },
            ],
            [
              { id: "state", options: [{ value: state, text: state }] },
              { id: "country", options: [{ value: country, text: country }] },
            ]
          )}
      </form>
      <div class="model-footer">
          <div class="btn-group">
              <button class="cmn-btn save-btn" style="background: #000;" onClick={(e) => saveForm(e)}>Save</button>
              <button class="modelclose" style="background: #000;" onClick={closePopup}>Cancel</button>
          </div>
      </div>`;
    openPopup();
  };

  const createFormInput = (id, placeholder, value) => `
    <div class="form-control">
        <input id="${id}" type="text" placeholder="${placeholder}" value="${value}">
    </div>`;

  const createFormSelect = (id, options) => `
    <div class="form-control">
        <select id="${id}">
            ${options.map(({ value, text }) => `<option value="${value}">${text}</option>`).join('')}
        </select>
    </div>`;

  const createPopupForm = (inputs, selects) => `
    ${inputs.map(({ id, placeholder, value }) => createFormInput(id, placeholder, value)).join('')}
    ${selects.map(({ id, options }) => createFormSelect(id, options)).join('')}`;

  const saveForm = async (e) => {
    e.preventDefault();

    const newAddress1 = document.getElementById("address1").value;
    const newAddress2 = document.getElementById("address2").value;
    const newCity = document.getElementById("city").value;
    const newState = document.getElementById("state").value;
    const newCountry = document.getElementById("country").value;
    const newZip = document.getElementById("pincode").value;
    const newPhone = document.getElementById("phone").value;

    const requestData = {
      shop_name: Shopify.shop,
      orderId: orderId,
      new_address1: newAddress1,
      new_address2: newAddress2,
      new_city: newCity,
      new_state: newState,
      new_country: newCountry,
      new_zip: newZip,
      new_phone: newPhone,
    };

    const headers = {
      "X-CSRF-TOKEN": csrfToken,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch("/edit-order-address", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Address updated successfully");
        closePopup();
      } else {
        console.error("Failed to update address", result.error);
      }
    } catch (error) {
      console.error("Error updating address", error);
    }
  };

  const openPopup = () => {
    const popupContainer = document.querySelector(".enPopupmodel");
    popupContainer.classList.add("show");
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);
    overlay.addEventListener("click", closePopup);
  };

  const closePopup = () => {
    const popupContainer = document.querySelector(".enPopupmodel");
    popupContainer.classList.remove("show");
    const overlay = document.querySelector(".overlay");
    if (overlay) {
      overlay.remove();
    }
  };

  const loadEditOrderPopup = () => {
    // Your logic to load the edit order popup goes here.
    openPopup();
  };

  const AddItemsPopup = () => {
    const container = document.createElement("div");
    container.innerHTML = addItemBtnHTML;
    document.querySelector(".order-details").appendChild(container);
  };

  return (
    <div className="my-component">
      {/* Your component structure and additional logic goes here */}
      <div className="enPopupmodel"></div>
    </div>
  );
};

export default MyComponent;

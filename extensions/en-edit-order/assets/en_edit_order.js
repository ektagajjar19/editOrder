function importAtHead(csrfToken) {
  let metaTag = document.createElement("meta");
  metaTag.name = "csrf-token";
  metaTag.content = csrfToken;
  document.head.appendChild(metaTag);
  const linkElement = document.createElement("link");
  linkElement.rel = "stylesheet";
  linkElement.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
  document.head.appendChild(linkElement);
}

const csrfToken = "myCsrfToken";
importAtHead(csrfToken);

const deskURL = "https://portion-labeled-indices-myers.trycloudflare.com/";
const shopName = Shopify.shop;
let timeMsg = null;
var subtotal = 0;
let totalSum = 0;
var shipping = 0;
let tax = 0;
let taxCurrency = null;
var inventoryQuantity = 0;
let quantityInput = null;
var element = document.querySelector(".enButtonsEO");
var orderId = element.dataset.orderId;
var popupContainer = document.querySelector(".enPopupmodel");
const footer = document.querySelector(".order-details");
let addItemBtnHTML = null;
let currencyCode = null;
const currencySymbols = {
  AED: "د.إ", AFN: "؋", ALL: "L", AMD: "֏", ANG: "ƒ", AOA: "Kz", ARS: "$", AUD: "$", AWG: "ƒ", AZN: "₼", BAM: "KM", BBD: "$", BDT: "৳", BGN: "лв", BHD: ".د.ب", BIF: "FBu", BMD: "$", BND: "$", BOB: "Bs.", BRL: "R$", BSD: "$", BTN: "Nu.", BWP: "P", BYN: "Br", BZD: "$", CAD: "$", CDF: "FC", CHF: "CHF", CLP: "$", CNY: "¥", COP: "$", CRC: "₡", CUP: "₱", CVE: "$", CZK: "Kč", DJF: "Fdj", DKK: "kr", DOP: "RD$", DZD: "دج", EGP: "£", ERN: "Nfk", ETB: "Br", EUR: "€", FJD: "$", FKP: "£", GBP: "£", GEL: "₾", GGP: "£", GHS: "₵", GIP: "£", GMD: "D", GNF: "FG", GTQ: "Q", GYD: "$", HKD: "$", HNL: "L", HRK: "kn", HTG: "G", HUF: "Ft", IDR: "Rp", ILS: "₪", IMP: "£", INR: "₹", IQD: "ع.د", IRR: "﷼", ISK: "kr", JEP: "£", JMD: "$", JOD: "د.ا", JPY: "¥", KES: "KSh", KGS: "сом", KHR: "៛", KID: "$", KMF: "CF", KRW: "₩", KWD: "د.ك", KYD: "$", KZT: "₸", LAK: "₭", LBP: "ل.ل", LKR: "₨", LRD: "$", LSL: "M", LYD: "ل.د", MAD: "د.م.", MDL: "L", MGA: "Ar", MKD: "ден", MMK: "K", MNT: "₮", MOP: "MOP$", MRU: "UM", MUR: "₨", MVR: "Rf", MWK: "MK", MXN: "$", MYR: "RM", MZN: "MT", NAD: "$", NGN: "₦", NIO: "C$", NOK: "kr", NPR: "₨", NZD: "$", OMR: "ر.ع.", PAB: "B/.", PEN: "S/", PGK: "K", PHP: "₱", PKR: "₨", PLN: "zł", PYG: "₲", QAR: "ر.ق", RON: "lei", RSD: "дин", RUB: "₽", RWF: "RF", SAR: "ر.س", SBD: "$", SCR: "₨", SDG: "ج.س.", SEK: "kr", SGD: "$", SHP: "£", SLL: "Le", SOS: "S", SPL: "£", SRD: "$", STN: "Db", SVC: "$", SYP: "£", SZL: "E", THB: "฿", TJS: "ЅМ", TMT: "T", TND: "د.ت", TOP: "T$", TRY: "₺", TTD: "$", TVD: "$", TWD: "NT$", TZS: "TSh", UAH: "₴", UGX: "USh", USD: "$", UYU: "$", UZS: "soʻm", VES: "Bs.S.", VND: "₫", VUV: "VT", WST: "WS$", XAF: "FCFA", XCD: "$", XDR: "SDR", XOF: "CFA", XPF: "₣", YER: "﷼", ZAR: "R", ZMW: "ZK", ZWL: "$",
};

document.addEventListener("DOMContentLoaded", () => {
  const requestData = { shop_name: shopName, orderId: orderId };
  const headers = { "Content-Type": "application/json" };
  const endpoints = [
    `${deskURL}api/get/data`,
    `${deskURL}api/get/editorderdata`,
    `${deskURL}api/get/editaddressdata`,
    `${deskURL}api/get/additemsdata`,
    `${deskURL}api/getorderstatus`,
  ];
  const fetchData = (url, data) =>
    fetch(url, { method: "POST", headers: headers, body: JSON.stringify(data) })
      .then((response) => response.json())
      .catch((error) => {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
      });

  Promise.all(endpoints.map((url) => fetchData(url, requestData)))
    .then((results) => {
      const [ data, editOrderData, editAddressData, addItemsData, orderStatusData, ] = results;
      if (
        data && editOrderData && editAddressData && addItemsData && orderStatusData
      ) {
        let {
          displayFulfillmentStatus,
          country,
          province: state,
          city,
          zip,
          phone,
          address1,
          address2,
          remainingTimeInMinutes,
          remainingTimeInHours,
        } = orderStatusData.data;
        let {
          eo_btn_title: editOrderBtnTitle,
          eo_btn_bgcolor: editOrderBtnBgColor,
          eo_btn_textcolor: editOrderBtnTextColor,
          activate_at_order_status: activateEditOrderBtn,
        } = editOrderData;
        let {
          ea_btn_title: editAddressBtnTitle,
          ea_btn_bgcolor: editAddressBtnBgColor,
          ea_btn_textcolor: editAddressBtnTextColor,
          activate_at_order_status: activateEditAddressBtn,
        } = editAddressData;
        let {
          ai_btn_title: addItemBtnTitle,
          ai_btn_bgcolor: addItemBtnBgColor,
          ai_btn_textcolor: addItemBtnTextColor,
        } = addItemsData;
        addItemBtnHTML =
          '<div class="addItemsBtnDiv">' 
            +
              createButton("addItemBtn",addItemBtnTitle,addItemBtnBgColor,addItemBtnTextColor,"AddItemsPopup()")
            +
          `</div>
          <div class="newItems"></div>`;

        if (displayFulfillmentStatus === "UNFULFILLED") {
          if (remainingTimeInHours >= 0 && remainingTimeInMinutes >= 0) {
            timeMsg =
              remainingTimeInHours > 1
                ? `You have ${remainingTimeInHours} hours left.`
                : `You have ${remainingTimeInMinutes} minutes left.`;
            if (activateEditOrderBtn && activateEditAddressBtn) {
              createEditAddressDiv(editAddressBtnTitle,editAddressBtnBgColor,editAddressBtnTextColor,country,state,city,address1,address2,phone,zip,timeMsg);
              createEditOrderDiv(editOrderBtnTitle,editOrderBtnBgColor,editOrderBtnTextColor,timeMsg);
            } else if (activateEditOrderBtn) {
              createEditOrderDiv(editOrderBtnTitle,editOrderBtnBgColor,editOrderBtnTextColor,timeMsg);
            } else if (activateEditAddressBtn) {
              createEditAddressDiv(editAddressBtnTitle,editAddressBtnBgColor,editAddressBtnTextColor,country,state,city,address1,address2,phone,zip,timeMsg);
            }
          } else {
            const expiredDiv =
              '<div class="dynamic-div"><p class="expired">Your time limit has been expired to edit this order.</p></div>';
            insertAfter( document.createRange().createContextualFragment(expiredDiv),footer);
          }
        } else {
          const fulfilledDiv =
            "<div class='dynamic-div'><p class='expired'>This order is Fulfilled, now you can't edit this order.</p></div>";
            insertAfter(document.createRange().createContextualFragment(fulfilledDiv),footer);
        }
      } else {
        console.error("Failed to fetch all necessary data");
      }
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
    });
});

const createButton = (id, title, bgColor, textColor, onClick) => `
    <button id="${id}" style="background-color: ${bgColor}; color: ${textColor};" class="button-style" onclick="${onClick}">${title}</button>`;

const createDiv = (title, message, buttonHtml, timeMsg) =>
  `<div class="dynamic-div">
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
    if (footer) {
      const buttonHtml = createButton("EditOrderPopup",title,bgColor,textColor,"loadEditOrderPopup()");
      const editOrderDiv = createDiv( title, "Take control of your Edit order with these actions", buttonHtml, timeMsg );
      insertAfter(document.createRange().createContextualFragment(editOrderDiv),footer);
    }
  }
};

const createEditAddressDiv = (title, bgColor, textColor, country, state, city, address1, address2, phone, zip, timeMsg ) => 
{
  if (window.location.href.includes("orders")) {
    if (footer) {
      const buttonHtml = createButton(
        "EditAddressPopup",
        title,
        bgColor,
        textColor,
        `loadEditAddressPopup('${country}','${state}','${city}','${address1}','${address2}','${phone}','${zip}')`
      );
      const editAddressDiv = createDiv(
        title,
        "Need to change your shipping address? Click the button below to change your order's shipping address.",
        buttonHtml,
        timeMsg
      );
      insertAfter(
        document.createRange().createContextualFragment(editAddressDiv),
        footer
      );
    }
  }
};

const createFormInput = (id, placeholder, value) => `
    <div class="m-form-group">
        <input type="text" id="${id}" placeholder="${placeholder}" value="${value}" required>
        <span id="${id}-error" class="error-message"></span>
    </div>
`;

const createFormSelect = (id, options) => {
  const optionsHtml = options
    .map((option) => `<option value="${option.value}">${option.text}</option>`)
    .join("");
  return `
        <div class="m-form-group">
            <select id="${id}">${optionsHtml}</select>
            <span id="${id}-error" class="error-message"></span>
        </div>`;
};

const createPopupForm = (fields, selects) => `
    ${fields.map((field) => createFormInput(field.id, field.placeholder, field.value)).join("")}
    ${selects.map((select) => createFormSelect(select.id, select.options)).join("")}
`;

function loadEditAddressPopup(country,state,city,address1,address2,phone,zip) {
  // console.log(typeof(phone))
  if (phone == "null") {
    phone = '';
  }
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
                <button class="cmn-btn save-btn" style="background: #000;" onclick="saveForm(event)">Save</button>
                <button class="modelclose" style="background: #000;" onclick="closePopup()">Cancel</button>
            </div>
        </div>`;
  openPopup();
}

function loadEditOrderPopup() {
  popupContainer.innerHTML = `
        <div class="model-header">
            <h3>Edit Order</h3>
        </div>
        <div id="itemsContainer" class="itemsContainer"></div>
        <div class="model-footer">
            <div class="btn-group">
                <button class="cmn-btn save-btn" style="background: #000;" onclick="saveEOForm(event)">Save</button>
                <button class="modelclose" style="background: #000;" onclick="closePopup()">Cancel</button>
            </div>
        </div>`;
  openPopup();
  const orderDetails = {
    orderId: orderId,
    shopName: shopName,
  };
  fetch(deskURL + "api/fetch/updateOrder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrfToken,
    },
    body: JSON.stringify(orderDetails),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      if (data.status) {
        let itemsContainer = document.getElementById("itemsContainer");
        itemsContainer.innerHTML = "";
        const lastItemIndex = data.data.length - 1;
        subtotal = parseFloat(data.data[lastItemIndex].subtotal).toFixed(2);
        shipping = parseFloat(data.data[lastItemIndex].shipping);
        tax = parseFloat(data.data[lastItemIndex].tax).toFixed(2);
        taxCurrency = data.data[lastItemIndex].taxCurrency;
        currencyCode = data.data[lastItemIndex].currencyCode;
        const lineItems = data.data.slice(0, lastItemIndex);
        lineItems.forEach((item) => {
          let itemElement = createItemElement(item);
          itemsContainer.appendChild(itemElement);
        });
        const AddItemsDiv = addItemBtnHTML;

        const addedItemsDiv = `
        <p class="time-limit-message addItemPopupTime">${timeMsg}</p>
        <div class="collapsible-container">
            <div class="collapsible-section">
                <div class="collapsible-header">Added Items</div>
                <div class="collapsible-content">
                    <p>This is the content of Section 1.</p>
                </div>
            </div>
            <div class="collapsible-section">
                <div class="collapsible-header">Payments</div>
                  <div class="collapsible-content">
                    <table>
                        <tbody>
                            <tr>
                                <td>Old Subtotal</td>
                                <td class="old-amount">${subtotal}</td>
                            </tr>
                            <tr>
                                <td>Subtotal</td>
                                <td class="amount" id="subtotal"></td>
                            </tr>
                            <tr>
                                <td>Estimated Tax</td>
                                <td class="amount" id="tax">${tax}</td>
                            </tr>
                            <tr>
                                <td>Shipping Charges</td>
                                <td class="amount" id="shipping">${shipping}</td>
                            </tr>
                            <tr>
                                <td>Net Payment</td>
                                <td class="net-amount"></td>
                            </tr>
                        </tbody>
                    </table>
                  </div>
                </div>
            </div>`;
        const items = document.getElementById("itemsContainer");
        insertAfter(
          document.createRange().createContextualFragment(AddItemsDiv + addedItemsDiv),items
        );
        const headers = document.querySelectorAll(".collapsible-header");
        const contents = document.querySelectorAll(".collapsible-content");
        headers.forEach((header, index) => {
          header.addEventListener("click", () => {
            contents.forEach((content, contentIndex) => {
              if (contentIndex !== index) {
                content.style.maxHeight = null;
                content.classList.remove("active");
              }
            });
            const content = contents[index];
            if (content.classList.contains("active")) {
              content.style.maxHeight = null;
            } else {
              content.style.maxHeight = content.scrollHeight + "px";
              if (header.textContent === "Payments") {
                updateSubtotal();
              }
            }
            content.classList.toggle("active");
          });
        });
      } else {
        alert("Something went wrong with the order update.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Something went wrong.");
    });
}

function validateForm() {
  const requiredFields = [
    "address1",
    "address2",
    "city",
    "pincode",
    "state",
    "country",
    // "phone",
  ];
  let isValid = true;
  requiredFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (!field.value) {
      errorElement.textContent = `${field.placeholder} field is required.`;
      errorElement.style.display = "block";
      isValid = false;
    } else {
      errorElement.style.display = "none";
    }
  });
  return isValid;
}

function saveForm(event) {
  event.preventDefault();
  if (!validateForm()) {
    return;
  }
  const button = event.target;
  button.classList.add("button_loading");
  button.disabled = true;

  const formData = {
    orderId: orderId,
    shop_name: shopName,
    address1: document.getElementById("address1").value || null,
    address2: document.getElementById("address2").value || null,
    city: document.getElementById("city").value || null,
    pincode: document.getElementById("pincode").value || null,
    phone: document.getElementById("phone").value || null,
    state: document.getElementById("state").value || null,
    country: document.getElementById("country").value || null,
  };

  const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
  const csrfToken = csrfTokenMeta ? csrfTokenMeta.getAttribute("content") : "";

  fetch(deskURL + "api/fetch/updateOrderShippingAddress", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrfToken,
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      button.classList.remove("button_loading");
      button.disabled = false;

      if (data.status) {
        closePopup();
        alert("Shipping address updated successfully.");
        location.reload();
      } else {
        let errorMessage = data.message;
        if (data.errors && data.errors.length > 0) {
          errorMessage = data.errors.join(". ");
        }
        alert(errorMessage);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Something went wrong.");
      button.classList.remove("button_loading");
      button.disabled = false;
    });
}

function openPopup() {
  document.body.classList.add("custom-popup");
}

function closePopup() {
  document.body.classList.remove("custom-popup");
  popupContainer.innerHTML = "";
  totalSum = 0;
}

function createItemElement(item) {
  let itemElement = document.createElement("div");
  itemElement.classList.add("item");
  let imageSrc = item.image || "";
  let sanitizedId = sanitizeId(item.id);
  let variantsDropdown = "";
  if (item.orderedVariant.title !== "Default Title") {
    variantsDropdown = `
          <label for="variant-${sanitizedId}">Variant</label>
          <select id="variant-${sanitizedId}" name="variant">`;
    item.allVariants.forEach((variant) => {
      if (variant.inventoryQuantity > 0) {
        let isSelected =
          variant.id === item.orderedVariant.id ? "selected" : "";
        variantsDropdown += `<option value="${variant.id}" data-price="${variant.price}" data-inventory="${variant.inventoryQuantity}" ${isSelected}>${variant.title} - ${variant.price}</option>`;
      }
    });
    variantsDropdown += `</select>`;
  }
  let inventoryMessage =
    item.orderedVariant.inventoryQuantity < 10
      ? `<p id="inventory-msg-${sanitizedId}">${item.orderedVariant.inventoryQuantity} items are left</p>`
      : "";
  itemElement.innerHTML = `
      <div class="item-image">
        <div class="img-container"><img src="${imageSrc}" alt="${item.title}"></div>
      </div>
      <div class="item-details">
          <h3>${item.title}</h3>
          <p>Price: ${currencySymbols[currencyCode]}<span class="calcPrice" id="calcPrice-${sanitizedId}">${calculateTotalPrice(item)}</span></p>
          ${variantsDropdown}
          <label for="quantity-${sanitizedId}">Quantity</label>
          <div class="flexRow">
              <input type="number" id="quantity-${sanitizedId}" name="quantity" value="${item.quantity}" min="0" max="${item.orderedVariant.inventoryQuantity}">
              <a class="delete-button" data-id="${sanitizedId}" onclick="deleteItem('${sanitizedId}')">
                  <i class="fa fa-trash" aria-hidden="true"></i>
              </a>
          </div>
          ${inventoryMessage}
      </div>`;
  updatePriceSpan(itemElement, item);
  return itemElement;
}

function updatePriceSpan(itemElement, item) {
  let sanitizedId = sanitizeId(item.id);
  let quantityInput = itemElement.querySelector(`#quantity-${sanitizedId}`);
  let priceSpan = itemElement.querySelector(`#calcPrice-${sanitizedId}`);
  let variantSelect = itemElement.querySelector(`#variant-${sanitizedId}`);
  let inventoryMessage = itemElement.querySelector(
    `#inventory-msg-${sanitizedId}`
  );

  const updatePrice = () => {
    let selectedVariantPrice = parseFloat(
      variantSelect
        ? variantSelect.options[variantSelect.selectedIndex].dataset.price
        : item.orderedVariant.price
    );
    let quantity = parseInt(quantityInput.value);
    priceSpan.textContent = (selectedVariantPrice * quantity).toFixed(2);
    toggleItemOpacity(quantityInput, itemElement);
    updateSubtotal();
  };

  const updateInventoryMessage = () => {
    let selectedVariantInventory = parseInt(
      variantSelect.options[variantSelect.selectedIndex].dataset.inventory
    );
    quantityInput.max = selectedVariantInventory;

    if (selectedVariantInventory < 10) {
      if (!inventoryMessage) {
        inventoryMessage = document.createElement("p");
        inventoryMessage.id = `inventory-msg-${sanitizedId}`;
        quantityInput.parentNode.appendChild(inventoryMessage);
      }
      inventoryMessage.textContent = `${selectedVariantInventory} items are left`;
    } else {
      if (inventoryMessage) {
        inventoryMessage.remove();
      }
    }
  };
  quantityInput.addEventListener("input", updatePrice);
  if (variantSelect) {
    variantSelect.addEventListener("change", () => {
      updatePrice();
      toggleItemOpacity(quantityInput, itemElement);
      updateInventoryMessage();
    });
  }
}
function deleteItem(sanitizedId) {
  
  let itemElement = document
    .querySelector(`#quantity-${sanitizedId}`)
    .closest(".item");
  let quantityInput = itemElement.querySelector(`#quantity-${sanitizedId}`);
  let priceSpan = itemElement.querySelector(`#calcPrice-${sanitizedId}`);
  quantityInput.value = 0;
  priceSpan.textContent = "0.00";
  itemElement.style.opacity = "0.5";
  updateSubtotal();
}

function toggleItemOpacity(quantityInput, itemElement) {
  if (quantityInput.value == 0) {
    itemElement.style.opacity = "0.5";
  } else {
    itemElement.style.opacity = "1";
  }
}
function updatePrice(priceSpan, variantSelect, quantityInput, item) {
  let selectedVariantPrice = parseFloat(
    variantSelect
      ? variantSelect.options[variantSelect.selectedIndex].dataset.price
      : item.orderedVariant.price
  );
  let quantity = parseInt(quantityInput.value);
  priceSpan.textContent = (selectedVariantPrice * quantity).toFixed(2);
  updateSubtotal();
}
function updateSubtotal() {
  let priceSpans = document.querySelectorAll(".calcPrice");
  totalSum = 0;
  priceSpans.forEach((span) => {
    totalSum += parseFloat(span.textContent);
  });
  let subtotalElement = document.querySelector("#subtotal");
  if (subtotalElement) {
    subtotalElement.innerHTML = totalSum.toFixed(2);
  } else {
    console.error("Subtotal element not found");
  }
  let oldAmountCell = document.querySelector(".old-amount");
  let newAmountCell = document.querySelector(".amount");
  let netAmountCell = document.querySelector(".net-amount");
  let oldAmount = parseFloat(oldAmountCell.textContent) || 0;
  let newAmount = parseFloat(newAmountCell.textContent) || 0;
  let netAmount = newAmount - oldAmount;
  netAmountCell.textContent = netAmount.toFixed(2);
}

function calculateTotalPrice(item) {
  return (item.orderedVariant.price * item.quantity).toFixed(2);
}

function sanitizeId(id) {
  return id.replace(/[^A-Z0-9]+/ig, "_");
}

function saveEOForm(event) {
  event.preventDefault();
  const button = event.target;
  button.classList.add("button_loading");
  button.disabled = true;
  closePopup();
  button.classList.remove("button_loading");
}
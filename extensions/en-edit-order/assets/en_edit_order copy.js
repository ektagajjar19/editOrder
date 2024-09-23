const deskURL = "https://shoes-intended-stadium-diamonds.trycloudflare.com/";
var shopName = Shopify.shop;
var element = document.querySelector('.enButtonsEO');
var orderId = element.dataset.orderId;
var orderId = orderId;
document.addEventListener("DOMContentLoaded", function() {
    const requestData = {
        shop_name: shopName,
        orderId:orderId,
    };
    const headers = {
        "Content-Type": "application/json",
    };

    const endpoints = [
        "https://shoes-intended-stadium-diamonds.trycloudflare.com/api/get/data",
        "https://shoes-intended-stadium-diamonds.trycloudflare.com/api/get/editorderdata",
        "https://shoes-intended-stadium-diamonds.trycloudflare.com/api/get/editaddressdata",
        "https://shoes-intended-stadium-diamonds.trycloudflare.com/api/get/additemsdata",
        "https://shoes-intended-stadium-diamonds.trycloudflare.com/api/getorderstatus",
    ];

    function fetchData(url, data) {
        return fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .catch(error => {
            console.error(`Error fetching data from ${url}:`, error);
            return null;
        });
    }

    Promise.all(endpoints.map(url => fetchData(url, requestData)))
        .then(results => {
            const [data, editOrderData, editAddressData, addItemsData, orderStatusData] = results;

            if (data && editOrderData && editAddressData && addItemsData && orderStatusData) {
                console.log('Fetched data:', { data, editOrderData, editAddressData, addItemsData, orderStatusData });
                
                let {
                    displayFulfillmentStatus:displayFulfillmentStatus,
                    remainingTimeInMinutes:remainingTimeInMinutes,
                    remainingTimeInHours: remainingTimeInHours,
                    tag:tag,
                } = orderStatusData.data;

                let {
                    eo_success_msg: editOrderSuccessMsg,
                    eo_error_msg: editOrderErrorMsg,
                    eo_btn_title: editOrderBtnTitle,
                    eo_btn_bgcolor: editOrderBtnBgColor,
                    eo_btn_textcolor: editOrderBtnTextColor,
                    eo_popup_title: editOrderPopupTitle,
                    eo_popup_btn_title: editOrderPopupButton,
                    eo_popup_title_color: editOrderPopupTitleColor,
                    eo_popup_bg_color: editOrderPopupBgColor,
                    eo_popup_btn_color: editOrderPopupBtnColor,
                    eo_popup_border_color: editOrderPopupBorderColor,
                    eo_layout_alignment: editOrderLayoutAlignment,
                    activate_at_order_status: activateEditOrderBtn
                } = editOrderData;

                // Extract data for address editing
                let {
                    ea_success_msg: editAddressSuccessMsg,
                    ea_error_msg: editAddressErrorMsg,
                    ea_btn_title: editAddressBtnTitle,
                    ea_btn_bgcolor: editAddressBtnBgColor,
                    ea_btn_textcolor: editAddressBtnTextColor,
                    ea_popup_title: editAddressPopupTitle,
                    ea_popup_btn_title: editAddressPopupButton,
                    ea_popup_title_color: editAddressPopupTitleColor,
                    ea_popup_bg_color: editAddressPopupBgColor,
                    ea_popup_btn_color: editAddressPopupBtnColor,
                    ea_popup_border_color: editAddressPopupBorderColor,
                    ea_layout_alignment: editAddressLayoutAlignment,
                    activate_at_order_status: activateEditAddressBtn
                } = editAddressData;

                // Extract data for adding items
                let {
                    ai_success_msg: addItemsSuccessMsg,
                    ai_error_msg: addItemsErrorMsg,
                    ai_btn_title: addItemsBtnTitle,
                    ai_btn_bgcolor: addItemsBtnBgColor,
                    ai_btn_textcolor: addItemsBtnTextColor,
                    ai_layout_alignment: addItemsLayoutAlignment,
                    activate_at_order_status: activateAddItems
                } = addItemsData;

                if(remainingTimeInMinutes>0 && remainingTimeInHours <=1){
                    timeMsgEditOrder = "You have " + remainingTimeInMinutes + " minute left for Edit Order."
                    timeMsgEditAddress = "You have " + remainingTimeInMinutes + " minute left for Edit Address."
                }
                else if(remainingTimeInHours > 1){
                    timeMsgEditOrder = "You have " + remainingTimeInHours + " hours left for Edit Order."
                    timeMsgEditAddress = "You have " + remainingTimeInHours + " hours left for Edit Address."
                }
                if(displayFulfillmentStatus == "UNFULFILLED"){   
                    if (activateEditOrderBtn && activateEditAddressBtn) {
                        EditAddressDiv({
                            timeLimit: data.time_limit,
                            editAddressBtnTitle,
                            editAddressBtnBgColor,
                            editAddressBtnTextColor,
                        });
                        EditOrderDiv({
                            timeLimit: data.time_limit,
                            editOrderBtnTitle,
                            editOrderBtnBgColor,
                            editOrderBtnTextColor,
                        });
                        
                    } else if(activateEditOrderBtn){
                        EditOrderDiv({
                            timeLimit: data.time_limit,
                            editOrderBtnTitle,
                            editOrderBtnBgColor,
                            editOrderBtnTextColor,
                        });
                    }
                    else if(activateEditAddressBtn){
                        EditAddressDiv({
                            timeLimit: data.time_limit,
                            editAddressBtnTitle,
                            editAddressBtnBgColor,
                            editAddressBtnTextColor,
                        });
                    }
                } 
                else{
                    console.log("YOu're Fulfillment status is " + displayFulfillmentStatus);
                }
            } else {
                console.error("Failed to fetch all necessary data or addItemsData is empty");
            }
        })
        .catch(err => {
            console.error("Error fetching data:", err);
        })
        .finally(() => {
            // console.log("Dynamic content injected");
        });
});
    
function EditOrderDiv({
    timeLimit,
    editOrderBtnTitle,
    editOrderBtnBgColor,
    editOrderBtnTextColor,
}) {
    if (window.location.href.includes("orders")) {

        let editOrderDiv = `
            <div class="dynamic-div">
                <h3>${editOrderBtnTitle}</h3>
                <p>Take control of your Edit order with these actions</p>
                <button onclick="EditOrderPopup()" id="EditOrderPopup" style="background-color: ${editOrderBtnBgColor}; color: ${editOrderBtnTextColor};" class="button-style">${editOrderBtnTitle}</button>
                <p class="time-limit-message">${timeMsgEditOrder}</p>
                
                <div id="editOrderPopup" class="custom-model-main">
                    <div class="bg-overlay"></div>
                    <div class="popup-content">
                        <button id="closeEditOrder" class="close-btn">Close</button>
                        Edit Order Content Here 
                    </div>
                </div>
            </div>
            
        `;
        
        let footer = document.querySelector('.order-details');
        if (footer) {
            footer.insertAdjacentHTML('afterend', editOrderDiv);
        }
    }
}
function EditAddressDiv({
    timeLimit,
    editAddressBtnTitle,
    editAddressBtnBgColor,
    editAddressBtnTextColor,
}) {
    if (window.location.href.includes("orders")) {
        let editShippingDiv = `
            <div class="dynamic-div">
                <h3>${editAddressBtnTitle}</h3>
                <p>Need to change your sipping address? Click the button below to change your order's shipping address.</p>
                <button onclick="EditAddressPopup()" id="EditAddressPopup" style="background-color: ${editAddressBtnBgColor}; color: ${editAddressBtnTextColor};" class="button-style">${editAddressBtnTitle}</button>
                <p class="time-limit-message">${timeMsgEditAddress}</p>

                <div id="editAddressPopup" class="custom-model-main">
                    <div class="bg-overlay"></div>
                    <div class="popup-content">
                        <button id="closeEditAddress" class="close-btn">Close</button>
                        Edit Address Content Here 
                    </div>
                </div>
            </div>
            
        `;
        
        let footer = document.querySelector('.order-details');
        if (footer) {
            footer.insertAdjacentHTML('afterend', editShippingDiv);
        }
    }
}

function EditOrderPopup(){
    console.log('EditOrderPopup Called');
    const popup = document.getElementById('editOrderPopup');
    const overlay = popup.querySelector('.bg-overlay');
    if (popup.classList.contains('model-open')) {
        popup.classList.remove('model-open');
    } else {
        popup.classList.add('model-open');
    }
    overlay.addEventListener('click', () => {
        popup.classList.remove('model-open');
    });
    const closeBtn = popup.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        popup.classList.remove('model-open');
    });
};
function EditAddressPopup(){
    console.log('EditOrderPopup Called');
    const popup = document.getElementById('editAddressPopup');
    const overlay = popup.querySelector('.bg-overlay');
    if (popup.classList.contains('model-open')) {
        popup.classList.remove('model-open');
    } else {
        popup.classList.add('model-open');
    }
    overlay.addEventListener('click', () => {
        popup.classList.remove('model-open');
    });
    const closeBtn = popup.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        popup.classList.remove('model-open');
    });
};
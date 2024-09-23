console.log("en_edit_order.js")
// alert("en_edit_order.js");
document.addEventListener("DOMContentLoaded", function() {
    Promise.all([
        fetch("https://prot-drawing-fully-consortium.trycloudflare.com/api/get/data").then(res => res.json()),
        fetch("https://prot-drawing-fully-consortium.trycloudflare.com/api/get/editorderdata").then(res => res.json()),
        fetch("https://prot-drawing-fully-consortium.trycloudflare.com/api/get/editaddressdata").then(res => res.json()),
        fetch("https://prot-drawing-fully-consortium.trycloudflare.com/api/get/additemsdata").then(res => res.json())
    ])
    .then(([data, editOrderData, editAddressData, addItemsData]) => {
        console.log('Fetched data:', { data, editOrderData, editAddressData, addItemsData });
        // Extract data for order editing
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
            eo_layout_alignment: editOrderLayoutAlignment
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
            ea_layout_alignment: editAddressLayoutAlignment
        } = editAddressData;

        // Extract data for adding items
        let {
            ai_success_msg: addItemsSuccessMsg,
            ai_error_msg: addItemsErrorMsg,
            ai_btn_title: addItemsBtnTitle,
            ai_btn_bgcolor: addItemsBtnBgColor,
            ai_btn_textcolor: addItemsBtnTextColor,
            ai_layout_alignment: addItemsLayoutAlignment
        } = addItemsData;

        // Check if the modal popup should be opened
        if (!localStorage.getItem('hasClosedPopup')) {
            openModal();
        }

        // Inject dynamic content based on the fetched data
        injectDynamicContent({
            timeLimit: data.time_limit,
            editOrderBtnTitle,
            editOrderBtnBgColor,
            editOrderBtnTextColor,
            editAddressBtnTitle,
            editAddressBtnBgColor,
            editAddressBtnTextColor,
            addItemsBtnTitle,
            addItemsBtnBgColor,
            addItemsBtnTextColor
        });
    })
    .catch(err => {
        console.error("Error fetching data:", err);
        // Optionally, show user feedback here
    })
    .finally(() => {
        console.log("Dynamic content injected");
    });
});


function openModal() {
    console.log('OpenModel Called');
}

function injectDynamicContent({ timeLimit, editOrderBtnTitle, editOrderBtnBgColor, editOrderBtnTextColor, editAddressBtnTitle, editAddressBtnBgColor, editAddressBtnTextColor, addItemsBtnTitle, addItemsBtnBgColor, addItemsBtnTextColor }) {
    if ((window.location.href.includes("orders"))) {
        let timeLimitInMinutes = timeLimit;

        let editOrderDiv = `
            <div style="background-color: #FFF3CD; padding: 10px; margin-bottom: 10px;">
                <p>${editOrderBtnTitle}</p>
                <button style="background-color: ${editOrderBtnBgColor}; color: ${editOrderBtnTextColor};">${editOrderBtnTitle}</button>
                ${timeLimitInMinutes < 120 ? `<p>You have ${timeLimitInMinutes} minutes left to edit this order</p>` : ''}
            </div>
        `;

        let editShippingDiv = `
            <div style="background-color: #FFF3CD; padding: 10px; margin-bottom: 10px;">
                <p>${editAddressBtnTitle}</p>
                <button style="background-color: ${editAddressBtnBgColor}; color: ${editAddressBtnTextColor};">${editAddressBtnTitle}</button>
                ${timeLimitInMinutes < 120 ? `<p>You have ${timeLimitInMinutes} minutes left to edit shipping address</p>` : ''}
            </div>
        `;

        let footer = document.querySelector('.order-details');
        if (footer) {
            footer.insertAdjacentHTML('beforebegin', editOrderDiv + editShippingDiv + editBillingDiv);
        }
    }
}

import {
    Form,
    FormLayout,
    TextField,
    Toast,
    Page,
    InlineError,
    Layout,
    Loading,
    Frame,
    PageActions,
    Card,
} from "@shopify/polaris";
import { useState, useCallback, useEffect, useRef } from "react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import GuidCotentModel from "../components/GuidCotentModel";
import FooterAction from "../components/Footer";
import Messages from "../components/Messages";
import PopupComponent from "../components/PopupComponent";
import ButtonConfigration from "../components/ButtonConfiguration";

export default function translationlayout() {
    const dataFetchedRef = useRef(false);
    /* Default Loading is true */
    const [loading, setLoading] = useState(true);
    const [storeUrl, setStoreUrl] = useState('');
    const [active, setActive] = useState(false);
    const [message, setMessage] = useState("Success");
    const [toasterroractive, setToasterroractive] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleActive = useCallback(() => setActive((active) => !active), []);
    const toggleErrorActive = useCallback(() => setToasterroractive((toasterroractive) => !toasterroractive), []);

    const toastMarkup = active ? (
        <Toast content={message} onDismiss={toggleActive} />
      ) : null;

      const errortoastMarkup = toasterroractive ? (
        <Toast content={message} error onDismiss={toggleErrorActive} />
      ) : null;

    //Edit Order Variables
    const [successMsgEditOrder, setEditOrderSuccessMsg] = useState("");
    const [errorMsgEditOrder, setEditOrderErrorMsg] = useState("");
    const [EditOrderBtnTitle, setEditOrderBtnTitle] = useState("");
    const [EditOrderBtnBgColor, setEditOrderBtnBgColor] = useState("");
    const [EditOrderBtnTextColor, setEditOrderBtnTextColor] = useState("");
    const [EditOrderpopupTitle, setEditOrderpopupTitle] = useState("");
    const [EditOrderpopupButton, setEditOrderpopupButton] = useState("");
    const [EditOrderpopupTitleColor, setEditOrderpopupTitleColor] = useState("");
    const [EditOrderpopupBgColor, setEditOrderpopupBgColor] = useState("");
    const [EditOrderpopupBtnColor, setEditOrderpopupBtnColor] = useState("");
    const [EditOrderpopupBorderColor, setEditOrderpopupBorderColor] = useState("");
    const [EditOrderLayoutAlignment, setEditOrderLayoutAlignment] = useState("");

    //Edit Address Variables
    const [successMsgEditAddress, setEditAddressSuccessMsg] = useState("");
    const [errorMsgEditAddress, setEditAddressErrorMsg] = useState("");
    const [EditAddressBtnTitle, setEditAddressBtnTitle] = useState("");
    const [EditAddressBtnBgColor, setEditAddressBtnBgColor] = useState("");
    const [EditAddressBtnTextColor, setEditAddressBtnTextColor] = useState("");
    const [EditAddresspopupTitle, setEditAddresspopupTitle] = useState("");
    const [EditAddresspopupButton, setEditAddresspopupButton] = useState("");
    const [EditAddresspopupTitleColor, setEditAddresspopupTitleColor] = useState("");
    const [EditAddresspopupBgColor, setEditAddresspopupBgColor] = useState("");
    const [EditAddresspopupBtnColor, setEditAddresspopupBtnColor] = useState("");
    const [EditAddresspopupBorderColor, setEditAddresspopupBorderColor] = useState("");
    const [EditAddressLayoutAlignment, setEditAddressLayoutAlignment] = useState("");

    //Add Items Variables
    const [successMsgAddItems, setAddItemsSuccessMsg] = useState("");
    const [errorMsgAddItems, setAddItemsErrorMsg] = useState("");
    const [AddItemsBtnTitle, setAddItemsBtnTitle] = useState("");
    const [AddItemsBtnBgColor, setAddItemsBtnBgColor] = useState("");
    const [AddItemsBtnTextColor, setAddItemsBtnTextColor] = useState("");
    const [AddItemsLayoutAlignment, setAddItemsLayoutAlignment] = useState("");

    const handleSubmit = useCallback((_event) => {
        setIsSubmitting(true);
        _event.preventDefault();

        const updData = {
            formtype: "transaction",
            successMsgEditOrder,
            errorMsgEditOrder,
            EditOrderBtnTitle,
            EditOrderBtnBgColor,
            EditOrderBtnTextColor,
            EditOrderpopupTitle,
            EditOrderpopupButton,
            EditOrderpopupTitleColor,
            EditOrderpopupBgColor,
            EditOrderpopupBtnColor,
            EditOrderpopupBorderColor,
            EditOrderLayoutAlignment,
            successMsgEditAddress,
            errorMsgEditAddress,
            EditAddressBtnTitle,
            EditAddressBtnBgColor,
            EditAddressBtnTextColor,
            EditAddresspopupTitle,
            EditAddresspopupButton,
            EditAddresspopupTitleColor,
            EditAddresspopupBgColor,
            EditAddresspopupBtnColor,
            EditAddresspopupBorderColor,
            EditAddressLayoutAlignment,
            successMsgAddItems,
            errorMsgAddItems,
            AddItemsBtnTitle,
            AddItemsBtnBgColor,
            AddItemsBtnTextColor,
            AddItemsLayoutAlignment,
        };

        fetch('/api/data', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updData)
        })
        .then(response => {
            setIsSubmitting(false);
            if (!response.ok) {
                console.error('Network response was not ok:', response.status, response.statusText);
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        // .then(text => {
        .then(data => {
            try {
                // console.log('Response text:', text);
                console.log('Response data:', data);
                if (data.success === "success") {
                    setMessage("Updated Successfully!");
                    setActive(true);
                } else if (data.errors) {
                    setMessage("Something went wrong!");
                    setToasterroractive(true);
                }
            } catch (error) {
                // console.error('Error parsing JSON:', error, 'Response text:', text);
                console.error('Error handling response data:', error);
                setMessage("Invalid JSON response");
                setToasterroractive(true);
            }
        })
        .catch(error => {
            setIsSubmitting(false);
            setMessage("Something went wrong!");
            setToasterroractive(true);
            console.error('Fetch error:', error)
        });
    }, [
        successMsgEditOrder, errorMsgEditOrder, EditOrderBtnTitle,
        EditOrderBtnBgColor, EditOrderBtnTextColor, EditOrderpopupTitle,
        EditOrderpopupButton, EditOrderpopupTitleColor, EditOrderpopupBgColor,
        EditOrderpopupBtnColor, EditOrderpopupBorderColor, EditOrderLayoutAlignment,
        successMsgEditAddress, errorMsgEditAddress, EditAddressBtnTitle, EditAddressBtnBgColor,
        EditAddressBtnTextColor, EditAddresspopupTitle, EditAddresspopupButton, EditAddresspopupTitleColor,
        EditAddresspopupBgColor, EditAddresspopupBtnColor, EditAddresspopupBorderColor, EditAddressLayoutAlignment,
        successMsgAddItems,errorMsgAddItems,AddItemsBtnTitle,AddItemsBtnBgColor,AddItemsBtnTextColor,AddItemsLayoutAlignment,
    ]);
    const fetch = useAuthenticatedFetch();
    const handleClick = () => {
        fetch('/enable-app', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            body: JSON.stringify({
                shop_domain: {storeUrl}
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        window.open(
            `https://${storeUrl}/admin/themes/current/editor?context=apps&activateAppId=en-edit-order-app-embed`,
        );
    };

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        setLoading(true);
        Promise.all([
        fetch("/api/get/data").then((res) => res.json()),
        fetch("/api/get/editorderdata").then((res) => res.json()),
        fetch("/api/get/editaddressdata").then((res) => res.json()),
        fetch("/api/get/additemsdata").then((res) => res.json())
        ])
        .then(([data, editOrderData, editAddressData, addItemsData]) => {
            setStoreUrl(data.store);
            setEditOrderSuccessMsg(editOrderData.eo_success_msg);
            setEditOrderErrorMsg(editOrderData.eo_error_msg);
            setEditOrderBtnTitle(editOrderData.eo_btn_title);
            setEditOrderBtnBgColor(editOrderData.eo_btn_bgcolor);
            setEditOrderBtnTextColor(editOrderData.eo_btn_textcolor);
            setEditOrderpopupTitle(editOrderData.eo_popup_title);
            setEditOrderpopupButton(editOrderData.eo_popup_btn_title);
            setEditOrderpopupTitleColor(editOrderData.eo_popup_title_color);
            setEditOrderpopupBgColor(editOrderData.eo_popup_bg_color);
            setEditOrderpopupBtnColor(editOrderData.eo_popup_btn_color);
            setEditOrderpopupBorderColor(editOrderData.eo_popup_border_color);
            setEditOrderLayoutAlignment(editOrderData.eo_layout_alignment);
            setEditAddressSuccessMsg(editAddressData.ea_success_msg);
            setEditAddressErrorMsg(editAddressData.ea_error_msg);
            setEditAddressBtnTitle(editAddressData.ea_btn_title);
            setEditAddressBtnBgColor(editAddressData.ea_btn_bgcolor);
            setEditAddressBtnTextColor(editAddressData.ea_btn_textcolor);
            setEditAddresspopupTitle(editAddressData.ea_popup_title);
            setEditAddresspopupButton(editAddressData.ea_popup_btn_title);
            setEditAddresspopupTitleColor(editAddressData.ea_popup_title_color);
            setEditAddresspopupBgColor(editAddressData.ea_popup_bg_color);
            setEditAddresspopupBtnColor(editAddressData.ea_popup_btn_color);
            setEditAddresspopupBorderColor(editAddressData.ea_popup_border_color);
            setEditAddressLayoutAlignment(editAddressData.ea_layout_alignment);
            setAddItemsSuccessMsg(addItemsData.ai_success_msg);
            setAddItemsErrorMsg(addItemsData.ai_error_msg);
            setAddItemsBtnTitle(addItemsData.ai_btn_title);
            setAddItemsBtnBgColor(addItemsData.ai_btn_bgcolor);
            setAddItemsBtnTextColor(addItemsData.ai_btn_textcolor);
            setAddItemsLayoutAlignment(addItemsData.ai_layout_alignment);
            const hasClosedPopup = localStorage.getItem('hasClosedPopup');
            if (!hasClosedPopup) {
                setIsModalOpen(true);
            }
        })
        .catch((err) => {
        console.error(err);
        })
        .finally(() => {
        setLoading(false);
        });
        }, [fetch]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    if (loading) {
        return (
            <Frame>
                <Loading />
            </Frame>
        );
    }
    return (
        <Frame>
            <Page
                title="General"
                primaryAction={{
                    content: "Enable App",
                    onAction: handleClick,
                }}
            >
                <Form>
                    <Layout>
                        <Messages
                            //Edit Order
                            successMsgEditOrder={successMsgEditOrder}
                            setEditOrderSuccessMsg={setEditOrderSuccessMsg}
                            errorMsgEditOrder={errorMsgEditOrder}
                            setEditOrderErrorMsg={setEditOrderErrorMsg}
                            //Edit Address
                            successMsgEditAddress={successMsgEditAddress}
                            setEditAddressSuccessMsg={setEditAddressSuccessMsg}
                            errorMsgEditAddress={errorMsgEditAddress}
                            setEditAddressErrorMsg={setEditAddressErrorMsg}
                            //AddItems
                            successMsgAddItems={successMsgAddItems}
                            setAddItemsSuccessMsg={setAddItemsSuccessMsg}
                            errorMsgAddItems={errorMsgAddItems}
                            setAddItemsErrorMsg={setAddItemsErrorMsg}
                        />
                        <ButtonConfigration
                            // EditOrder
                            EditOrderBtnTitle={EditOrderBtnTitle}
                            setEditOrderBtnTitle={setEditOrderBtnTitle}
                            EditOrderBtnBgColor={EditOrderBtnBgColor}
                            setEditOrderBtnBgColor={setEditOrderBtnBgColor}
                            EditOrderBtnTextColor={EditOrderBtnTextColor}
                            setEditOrderBtnTextColor={setEditOrderBtnTextColor}
                            // EditAddress
                            EditAddressBtnTitle={EditAddressBtnTitle}
                            setEditAddressBtnTitle={setEditAddressBtnTitle}
                            EditAddressBtnBgColor={EditAddressBtnBgColor}
                            setEditAddressBtnBgColor={setEditAddressBtnBgColor}
                            EditAddressBtnTextColor={EditAddressBtnTextColor}
                            setEditAddressBtnTextColor={setEditAddressBtnTextColor}
                            // AddItems
                            AddItemsBtnTitle={AddItemsBtnTitle}
                            setAddItemsBtnTitle={setAddItemsBtnTitle}
                            AddItemsBtnBgColor={AddItemsBtnBgColor}
                            setAddItemsBtnBgColor={setAddItemsBtnBgColor}
                            AddItemsBtnTextColor={AddItemsBtnTextColor}
                            setAddItemsBtnTextColor={setAddItemsBtnTextColor}
                        />
                        <PopupComponent
                            //EditOrder
                            EditOrderpopupTitle={EditOrderpopupTitle}
                            setEditOrderpopupTitle={setEditOrderpopupTitle}
                            EditOrderpopupButton={EditOrderpopupButton}
                            setEditOrderpopupButton={setEditOrderpopupButton}
                            EditOrderpopupTitleColor={EditOrderpopupTitleColor}
                            setEditOrderpopupTitleColor={setEditOrderpopupTitleColor}
                            EditOrderpopupBgColor={EditOrderpopupBgColor}
                            setEditOrderpopupBgColor={setEditOrderpopupBgColor}
                            EditOrderpopupBtnColor={EditOrderpopupBtnColor}
                            setEditOrderpopupBtnColor={setEditOrderpopupBtnColor}
                            EditOrderpopupBorderColor={EditOrderpopupBorderColor}
                            setEditOrderpopupBorderColor={setEditOrderpopupBorderColor}
                            EditOrderLayoutAlignment={EditOrderLayoutAlignment}
                            setEditOrderLayoutAlignment={setEditOrderLayoutAlignment}
                            //EditAddress
                            EditAddresspopupTitle={EditAddresspopupTitle}
                            setEditAddresspopupTitle={setEditAddresspopupTitle}
                            EditAddresspopupButton={EditAddresspopupButton}
                            setEditAddresspopupButton={setEditAddresspopupButton}
                            EditAddresspopupTitleColor={EditAddresspopupTitleColor}
                            setEditAddresspopupTitleColor={setEditAddresspopupTitleColor}
                            EditAddresspopupBgColor={EditAddresspopupBgColor}
                            setEditAddresspopupBgColor={setEditAddresspopupBgColor}
                            EditAddresspopupBtnColor={EditAddresspopupBtnColor}
                            setEditAddresspopupBtnColor={setEditAddresspopupBtnColor}
                            EditAddresspopupBorderColor={EditAddresspopupBorderColor}
                            setEditAddresspopupBorderColor={setEditAddresspopupBorderColor}
                        />
                    </Layout>
                    <br />
                    <PageActions
                        primaryAction={{
                        content: 'Save',
                        onAction: handleSubmit,
                        loading: isSubmitting
                        }}
                    />
                </Form>
                <FooterAction />
                <div style={{ height: '500px', display: isModalOpen? 'block' : 'none' }}>
                    <GuidCotentModel isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
                </div>
            </Page>
            {toastMarkup}
            {errortoastMarkup}
        </Frame>
    );
}

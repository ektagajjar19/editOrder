import {
    Form,
    FormLayout,
    Toast,
    Page,
    Layout,
    Frame,
    Loading,
    PageActions,
    LegacyCard,
    RadioButton,
    TextField,
    Select,
    Checkbox,
    Text,
    Badge,
    InlineError
  } from "@shopify/polaris";
  import React from 'react';
  import { useState, useCallback, useEffect, useRef } from "react";
  import { useAppQuery, useAuthenticatedFetch } from "../hooks";
  import FooterAction from "../components/Footer";
  import OrderDetailLayoutComponent from "../components/OrderDetailLayoutComponent";
  import OrderStatusComponent from "../components/OrderStatusComponent";

export default function Settings() {
    const dataFetchedRef = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const fetch = useAuthenticatedFetch();
    const [checked, setChecked] = useState(false);
    const [active, setActive] = useState(false);
    const [message, setMessage] = useState("Success");
    const [toasterroractive, setToasterroractive] = useState(false);
    const toggleActive = useCallback(() => setActive((active) => !active), []);
    const toggleErrorActive = useCallback(() => setToasterroractive((toasterroractive) => !toasterroractive), []);
    const toastMarkup = active ? ( <Toast content={message} onDismiss={toggleActive} /> ) : null;
    const errortoastMarkup = toasterroractive ? ( <Toast content={message} error onDismiss={toggleErrorActive} /> ) : null;
    const [orderDetailLayoutAlignment, setOrderDetailLayoutAlignment] = useState('center');
    const [EditOrderBtnVisibility, setEditOrderBtnVisibility] = useState(0);
    const [EditAddressBtnVisibility, setEditAddressBtnVisibility] = useState(0);
    const [AddItemBtnVisibility, setAddItemBtnVisibility] = useState(0);
    const [orderDetailCheckoutLayoutAlignment, setOrderDetailCheckoutLayoutAlignment] = useState('center');
    const [OSEditOrderBtnVisibility, setOSEditOrderBtnVisibility] = useState(0);
    const [OSEditAddressBtnVisibility, setOSEditAddressBtnVisibility] = useState(0);
    const [OSAddItemBtnVisibility, setOSAddItemBtnVisibility] = useState(0);
    const [ExcludeTag, setExcludeTag] = useState('Exclude')
    const [EditOrderCssCode, setEditOrderCssCode] = useState('');
    const [timeLimit, setTimeLimit] = useState("");
    const isExcludeTagTxtInvalid = isValueInvalid(ExcludeTag);
    const errorMessageExcludeText = isExcludeTagTxtInvalid ? 'Exclude Tag is Required' : '';
    const [isRefund, setIsRefund] = useState(0);
    const [isRestock, setIsRestock] = useState(0);
    const handleChangeExcludeTagTxt = useCallback((val) => setExcludeTag(String(val)), [setExcludeTag]);
    const handleTagChange = (value) => { setChecked(value); };
    const handleChange = (value) => { setIsRefund(value); };
    const handleCancelRestockChange = (value) => { setIsRestock(value); };
    const handleCSSChange = (value) => { setEditOrderCssCode(value); };
    const options = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
        { label: '11', value: 11 },
        { label: '12', value: 12 },
        { label: '13', value: 13 },
        { label: '14', value: 14 },
        { label: '15', value: 15 },
        { label: '16', value: 16 },
        { label: '17', value: 17 },
        { label: '18', value: 18 },
        { label: '19', value: 19 },
        { label: '20', value: 20 },
        { label: '21', value: 21 },
        { label: '22', value: 22 },
        { label: '23', value: 23 },
        { label: '24', value: 24 },
      ];
      const handleSubmit = useCallback((_event) => {
        setIsSubmitting(true);
        _event.preventDefault();

        const updData = {
            formtype: "settings",
            orderDetailLayoutAlignment,
            EditOrderBtnVisibility,
            EditAddressBtnVisibility,
            AddItemBtnVisibility,
            orderDetailCheckoutLayoutAlignment,
            OSEditOrderBtnVisibility,
            OSEditAddressBtnVisibility,
            OSAddItemBtnVisibility,
            checked,
            ExcludeTag,
            EditOrderCssCode,
            timeLimit,
            isRefund,
            isRestock,
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
        .then(data => {
            try {
                console.log('Response data:', data);
                if (data.success === "success") {
                    setMessage("Updated Successfully!");
                    setActive(true);
                } else if (data.errors) {
                    setMessage("Something went wrong!");
                    setToasterroractive(true);
                }
            } catch (error) {
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
        orderDetailLayoutAlignment, EditOrderBtnVisibility, EditAddressBtnVisibility, AddItemBtnVisibility,
        orderDetailCheckoutLayoutAlignment, OSEditOrderBtnVisibility, OSEditAddressBtnVisibility, OSAddItemBtnVisibility,checked,
        ExcludeTag, EditOrderCssCode, timeLimit, isRefund, isRestock
    ]);

    function isValueInvalid(content) {
        return !content || content.length < 0;
    }
    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        Promise.all([
            fetch("/api/get/data")
                .then((res) => res.json())
                .then((data) => {
                    setOrderDetailLayoutAlignment(data.order_detail_layout_align);
                    setOrderDetailCheckoutLayoutAlignment(data.order_status_layout_align);
                    setEditOrderCssCode(data.editorder_css_code);
                    setTimeLimit(data.time_limit);
                    setExcludeTag(data.exclude_tag);
                    setIsRefund(data.is_refund);
                    setIsRestock(data.is_restock);
                    setChecked(data.is_exclude !== 0 ? data.is_exclude.toString() : '');
                }),
            fetch("/api/get/editorderdata")
                .then((res) => res.json())
                .then((data) => {
                    setOSEditOrderBtnVisibility(data.activate_at_order_status);
                    setEditOrderBtnVisibility(data.activate_at_order_details);
                }),
            fetch("/api/get/editaddressdata")
                .then((res) => res.json())
                .then((data) => {
                    setEditAddressBtnVisibility(data.activate_at_order_details);
                    setOSEditAddressBtnVisibility(data.activate_at_order_status);
                }),
            fetch("/api/get/additemsdata")
                .then((res) => res.json())
                .then((data) => {
                    setAddItemBtnVisibility(data.activate_at_order_details);
                    setOSAddItemBtnVisibility(data.activate_at_order_status);
                })
        ])
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [fetch]);

    if (loading) {
        return (
          <Frame>
            <Loading />
          </Frame>
        )
      }
    return (
        <Frame>
            <Page
                title="Settings"
                primaryAction={{
                    content: "Save",
                    onAction: handleSubmit,
                    loading: isSubmitting
                }}
            >
                {/* <hr /> */}
                <Form>
                    <Layout>
                        <OrderDetailLayoutComponent
                            orderDetailLayoutAlignment = {orderDetailLayoutAlignment}
                            setOrderDetailLayoutAlignment = {setOrderDetailLayoutAlignment}
                            EditOrderBtnVisibility = {EditOrderBtnVisibility}
                            EditAddressBtnVisibility = {EditAddressBtnVisibility}
                            AddItemBtnVisibility = {AddItemBtnVisibility}
                            setEditOrderBtnVisibility = {setEditOrderBtnVisibility}
                            setEditAddressBtnVisibility = {setEditAddressBtnVisibility}
                            setAddItemBtnVisibility = {setAddItemBtnVisibility}
                        />
                        <OrderStatusComponent
                            orderDetailCheckoutLayoutAlignment = {orderDetailCheckoutLayoutAlignment}
                            setOrderDetailCheckoutLayoutAlignment = {setOrderDetailCheckoutLayoutAlignment}
                            OSEditOrderBtnVisibility = {OSEditOrderBtnVisibility}
                            OSEditAddressBtnVisibility = {OSEditAddressBtnVisibility}
                            OSAddItemBtnVisibility = {OSAddItemBtnVisibility}
                            setOSEditOrderBtnVisibility = {setOSEditOrderBtnVisibility}
                            setOSEditAddressBtnVisibility = {setOSEditAddressBtnVisibility}
                            setOSAddItemBtnVisibility = {setOSAddItemBtnVisibility}
                        />
                        <Layout.AnnotatedSection
                            title="Custom CSS"
                            description='The custom CSS field allows you to add your own custom styles to your website.
                                         You can use CSS code to change the appearance of different elements,
                                         such as fonts, colors, and layout.'
                            >
                            <FormLayout>
                                <LegacyCard sectioned>
                                <TextField
                                    value={EditOrderCssCode}
                                    onChange={handleCSSChange}
                                    multiline={5}
                                    autoComplete="off"
                                />
                                </LegacyCard>
                            </FormLayout>
                        </Layout.AnnotatedSection>
                        <Layout.AnnotatedSection
                            title="Time Limit"
                            description="Set the time limit so in range between customers can only
                                          Edit/Add their order, Address and Add item within selected time."
                        >
                            <FormLayout>
                                <LegacyCard sectioned>
                                <Select
                                        label="Time Limit in Hours"
                                        options={options}
                                        onChange={(value) => {
                                            setTimeLimit(parseInt(value))
                                        }}
                                        value={timeLimit}
                                    />
                                </LegacyCard>
                            </FormLayout>
                        </Layout.AnnotatedSection>
                        <Layout.AnnotatedSection
                            title="Manage which orders can be edited"
                        >
                            <FormLayout>
                            <LegacyCard sectioned>
                                <Text variant="headingMd" as="h2">Not allow to update</Text>
                                <Checkbox
                                    label="Orders Tagged with : "
                                    checked={checked}
                                    onChange={handleTagChange}
                                />

                                {checked && (
                                    <>
                                        {!errorMessageExcludeText && (
                                    <Badge tone="attention" status="attention" style={{ marginLeft: '10px' }}>{ExcludeTag}</Badge>
                                        )}
                                        <div style={{ marginTop: '10px' }}></div>
                                        <TextField
                                            value={ExcludeTag}
                                            onChange={handleChangeExcludeTagTxt}
                                            autoComplete="off"
                                            type="text"
                                            id="excludeText"
                                            placeholder="Type your tag name here."
                                        />
                                        <div style={{ marginTop: '4px',marginBottom: '10px' }}>
                                            <InlineError message={errorMessageExcludeText} fieldID="excludeText" />
                                        </div>
                                        <Text as="h3" variant="headingSm" color="critical">
                                            Note: User needs to add same tag in Product detail page in Tags field.
                                        </Text>
                                    </>
                                )}
                            </LegacyCard>

                            </FormLayout>
                        </Layout.AnnotatedSection>
                        <Layout.AnnotatedSection
                            title="Refund"
                            description='"Refund Automatically" means the refund will be processed automatically
                            when an order is Edit, while "Refund Manually" means the refund will have to be processed manually
                            by the store owner.'
                        >
                            <FormLayout>
                                <LegacyCard sectioned>
                                <RadioButton
                                    label="Refund Manually"
                                    helpText="Merchant usually refunds manually to process it."
                                    checked={isRefund === 0}
                                    onChange={() => handleChange(0)}
                                />
                                <RadioButton
                                    label="Refund Automatically"
                                    helpText="This is usually done if the order has unfulfilled with paid."
                                    checked={isRefund === 1}
                                    onChange={() => handleChange(1)}
                                />
                                </LegacyCard>
                            </FormLayout>
                        </Layout.AnnotatedSection>
                        <Layout.AnnotatedSection
                            title="Restock"
                            description='Can specify here, whether you want to restock items manually or automatically when an order is edit'
                        >
                            <FormLayout>
                                <LegacyCard sectioned>
                                <RadioButton
                                    label="Restock Manually"
                                    helpText="Merchants can manually restock items after editing an order to ensure proper processing."
                                    checked={isRestock === 0}
                                    onChange={() => handleCancelRestockChange(0)}
                                />
                                <RadioButton
                                    label="Restock Automatically"
                                    helpText="Items will be automatically restocked after editing an order, eliminating the need for manual restocking by the merchant."
                                    checked={isRestock === 1}
                                    onChange={() => handleCancelRestockChange(1)}
                                />
                                </LegacyCard>
                            </FormLayout>
                        </Layout.AnnotatedSection>
                    </Layout>
                </Form>
                <br />
                <PageActions
                    primaryAction={{
                    content: 'Save',
                    onAction: handleSubmit,
                    loading: isSubmitting
                    }}
                />

                <FooterAction />
            </Page>
            {toastMarkup}
            {errortoastMarkup}
        </Frame>
    );
  }

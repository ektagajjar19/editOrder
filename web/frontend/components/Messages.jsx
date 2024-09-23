import {
    FormLayout,
    TextField,
    InlineError,
    Layout,
    Frame,
    LegacyCard,
    Text
} from "@shopify/polaris";
import { useCallback } from "react";

function MessageSection({
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    isSuccessMessageInvalid,
    successMessageErrorMsg,
    isErrorMessageInvalid,
    errorMessageErrorMsg,
    index,
}) {
    const handleChangeSuccess = useCallback((val) => setSuccessMessage(String(val)), [setSuccessMessage]);
    const handleChangeError = useCallback((val) => setErrorMessage(String(val)), [setErrorMessage]);

    return (
            <LegacyCard sectioned>
                <TextField
                    label="Success Message"
                    value={successMessage}
                    onChange={handleChangeSuccess}
                    autoComplete="off"
                    name={`success_msg${index}`}
                    type="text"
                    error={isSuccessMessageInvalid}
                />
                <div style={{ marginTop: '5px', marginBottom: '15px' }}>
                    <InlineError message={successMessageErrorMsg} />
                </div>
                <TextField
                    label="Error Message"
                    value={errorMessage}
                    onChange={handleChangeError}
                    autoComplete="off"
                    name={`error_msg${index}`}
                    type="text"
                    error={isErrorMessageInvalid}
                />
                <div style={{ marginTop: '4px' }}>
                    <InlineError message={errorMessageErrorMsg} />
                </div>
            </LegacyCard>
    );
}

export default function Messages(props) {
    const {
        successMsgEditOrder, setEditOrderSuccessMsg, errorMsgEditOrder, setEditOrderErrorMsg,
        successMsgEditAddress, setEditAddressSuccessMsg, errorMsgEditAddress, setEditAddressErrorMsg,
        successMsgAddItems, setAddItemsSuccessMsg, errorMsgAddItems, setAddItemsErrorMsg
    } = props;

    const isInvalidEditOrder = isValueInvalid(successMsgEditOrder);
    const isInvalidEditOrderError = isValueInvalid(errorMsgEditOrder);
    const isInvalidEditAddress = isValueInvalid(successMsgEditAddress);
    const isInvalidEditAddressError = isValueInvalid(errorMsgEditAddress);
    const isInvalidAddItems = isValueInvalid(successMsgAddItems);
    const isInvalidAddItemsError = isValueInvalid(errorMsgAddItems);

    const errorMessageEditOrder = isInvalidEditOrder ? 'Success Message is Required' : '';
    const errorMessageEditOrderError = isInvalidEditOrderError ? 'Error Message is Required' : '';
    const errorMessageEditAddress = isInvalidEditAddress ? 'Success Message is Required' : '';
    const errorMessageEditAddressError = isInvalidEditAddressError ? 'Error Message is Required' : '';
    const errorMessageAddItems = isInvalidAddItems ? 'Success Message is Required' : '';
    const errorMessageAddItemsError = isInvalidAddItemsError ? 'Error Message is Required' : '';

    function isValueInvalid(content) {
        return !content || content.length < 0;
    }
    let counter = 1;
    return (
            <Frame>
                <hr style={{ marginTop: '25px' }}/>
                <Layout.Section>
                    {/* <LegacyCard title="Messages" style={{backgroundColor: "#c3c3c3 !important"}} sectioned>
                        <p>
                            Please enter the desired text for different kinds of messages,
                            as you want them to appear on your Edit Order.
                        </p>
                    </LegacyCard> */}
                    <Text variant="headingMd" as="h2">Messages</Text>
                        <p>
                            Please enter the desired text for different kinds of messages,
                            as you want them to appear on your Edit Order.
                        </p>
                </Layout.Section>

                <Layout.AnnotatedSection title="Edit Order" description="When user can change item's Variant, Quantity etc.">
                    <FormLayout>
                        <MessageSection
                            successMessage={successMsgEditOrder}
                            setSuccessMessage={setEditOrderSuccessMsg}
                            errorMessage={errorMsgEditOrder}
                            setErrorMessage={setEditOrderErrorMsg}
                            isSuccessMessageInvalid={isInvalidEditOrder}
                            successMessageErrorMsg={errorMessageEditOrder}
                            isErrorMessageInvalid={isInvalidEditOrderError}
                            errorMessageErrorMsg={errorMessageEditOrderError}
                            index={counter++}
                        />
                    </FormLayout>
                </Layout.AnnotatedSection>

                <Layout.AnnotatedSection title="Edit Address" description="When user can change Billing & Shipping address">
                    <FormLayout>
                        <MessageSection
                            successMessage={successMsgEditAddress}
                            setSuccessMessage={setEditAddressSuccessMsg}
                            errorMessage={errorMsgEditAddress}
                            setErrorMessage={setEditAddressErrorMsg}
                            isSuccessMessageInvalid={isInvalidEditAddress}
                            successMessageErrorMsg={errorMessageEditAddress}
                            isErrorMessageInvalid={isInvalidEditAddressError}
                            errorMessageErrorMsg={errorMessageEditAddressError}
                            index={counter++}
                        />
                    </FormLayout>
                </Layout.AnnotatedSection>

                <Layout.AnnotatedSection title="Add Items" description="When user adds items">
                    <FormLayout>
                        <MessageSection
                            successMessage={successMsgAddItems}
                            setSuccessMessage={setAddItemsSuccessMsg}
                            errorMessage={errorMsgAddItems}
                            setErrorMessage={setAddItemsErrorMsg}
                            isSuccessMessageInvalid={isInvalidAddItems}
                            successMessageErrorMsg={errorMessageAddItems}
                            isErrorMessageInvalid={isInvalidAddItemsError}
                            errorMessageErrorMsg={errorMessageAddItemsError}
                            index={counter++}
                        />
                    </FormLayout>
                </Layout.AnnotatedSection>
            </Frame>
    );
}

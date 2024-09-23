import {
    FormLayout,
    TextField,
    Text,
    InlineError,
    Layout,
    LegacyCard,
    Frame,
    Popover,
    Button,
    LegacyStack,
    ColorPicker,
    hsbToHex,
} from "@shopify/polaris";
import { useState, useCallback } from "react";

function PopupSection({
    popupTitle,
    setpopupTitle,
    popupTitleErrorMsg,
    popupButton,
    setpopupButton,
    popupBtnTitleErrorMsg,
    popupTitleColor,
    setpopupTitleColor,
    popupBgColor,
    setpopupBgColor,
    popupBtnColor,
    setpopupBtnColor,
    popupBorderColor,
    setpopupBorderColor,
}) {
    const [popoverActiveBg, setPopoverActiveBg] = useState(false);
    const [popoverActiveTitleColor, setPopoverActiveTitleColor] =
        useState(false);
    const [popoverActiveBtnColor, setPopoverActiveBtnColor] = useState(false);
    const [popoverActiveBorder, setPopoverActiveBorder] = useState(false);

    const handleChangePopupTitle = useCallback(
        (val) => setpopupTitle(String(val)),
        [setpopupTitle],
    );
    const handleChangePopupBtn = useCallback(
        (val) => setpopupButton(String(val)),
        [setpopupButton],
    );
    const handleColorChangeBg = useCallback(
        (color) => {
            setpopupBgColor(hsbToHex(color));
            setColorBg(color);
        },
        [setpopupBgColor],
    );
    const handleColorChangeTitle = useCallback(
        (color) => {
            setpopupTitleColor(hsbToHex(color));
            setColorTitle(color);
        },
        [setpopupTitleColor],
    );
    const handleColorChangeBtn = useCallback(
        (color) => {
            setpopupBtnColor(hsbToHex(color));
            setColorBtn(color);
        },
        [setpopupBtnColor],
    );
    const handleColorChangeBorder = useCallback(
        (color) => {
            setpopupBorderColor(hsbToHex(color));
            setColorBorder(color);
        },
        [setpopupBorderColor],
    );

    const handlePopoverCloseTitleColor = useCallback(
        () => setPopoverActiveTitleColor(false),
        [],
    );
    const handlePopoverOpenTitleColor = useCallback(
        () => setPopoverActiveTitleColor(true),
        [],
    );
    const handlePopoverCloseBtnColor = useCallback(
        () => setPopoverActiveBtnColor(false),
        [],
    );
    const handlePopoverOpenBtnColor = useCallback(
        () => setPopoverActiveBtnColor(true),
        [],
    );
    const handlePopoverCloseBorder = useCallback(
        () => setPopoverActiveBorder(false),
        [],
    );
    const handlePopoverOpenBorder = useCallback(
        () => setPopoverActiveBorder(true),
        [],
    );
    const handlePopoverCloseBg = useCallback(
        () => setPopoverActiveBg(false),
        [],
    );
    const handlePopoverOpenBg = useCallback(() => setPopoverActiveBg(true), []);

    const isInvalidPopupTitle = isValueInvalid(popupTitle);
    const isInvalidPopupBtnTitle = isValueInvalid(popupButton);

    const [colorTitle, setColorTitle] = useState({
        hue: 240,
        brightness: 1,
        saturation: 1,
    });
    const [colorBtn, setColorBtn] = useState({
        hue: 120,
        brightness: 1,
        saturation: 1,
    });
    const [colorBg, setColorBg] = useState({
        hue: 240,
        brightness: 1,
        saturation: 1,
    });
    const [colorBorder, setColorBorder] = useState({
        hue: 120,
        brightness: 1,
        saturation: 1,
    });
    return (
        <LegacyCard sectioned>
            <TextField
                label="Popup Title"
                value={popupTitle}
                onChange={handleChangePopupTitle}
                autoComplete="off"
                name="popup_title"
                type="text"
                error={isInvalidPopupTitle}
            />
            <div style={{ marginTop: "5px", marginBottom: "15px" }}>
                <InlineError message={popupTitleErrorMsg} />
            </div>
            <TextField
                label="Popup Button Title"
                value={popupButton}
                onChange={handleChangePopupBtn}
                autoComplete="off"
                name="popup_btn_title"
                type="text"
                error={isInvalidPopupBtnTitle}
            />
            <div style={{ marginTop: "5px", marginBottom: "15px" }}>
                <InlineError message={popupBtnTitleErrorMsg} />
            </div>
            <div style={{ marginTop: "7px" }}>
                <Popover
                    active={popoverActiveTitleColor}
                    activator={
                        <Button
                            onClick={handlePopoverOpenTitleColor}
                            fullWidth
                            textAlign="left"
                        >
                            <LegacyStack
                                alignment="center"
                                spacing="tight"
                                sectioned
                            >
                                <div
                                    style={{
                                        height: "2rem",
                                        width: "2rem",
                                        borderRadius: "0.3rem",
                                        background: popupTitleColor
                                    }}
                                />
                                <span>Popup Title color</span>
                            </LegacyStack>
                        </Button>
                    }
                    onClose={handlePopoverCloseTitleColor}
                >
                    <Popover.Section>
                        <ColorPicker
                            onChange={handleColorChangeTitle}
                            color={colorTitle}
                            allowAlpha
                        />
                    </Popover.Section>
                    <Popover.Section>
                        <TextField value={popupTitleColor} />
                    </Popover.Section>
                </Popover>
            </div>
            <div style={{ marginTop: "7px" }}>
                <Popover
                    active={popoverActiveBtnColor}
                    activator={
                        <Button
                            onClick={handlePopoverOpenBtnColor}
                            fullWidth
                            textAlign="left"
                        >
                            <LegacyStack
                                alignment="center"
                                spacing="tight"
                                sectioned
                            >
                                <div
                                    style={{
                                        height: "2rem",
                                        width: "2rem",
                                        borderRadius: "0.3rem",
                                        background: popupBtnColor
                                    }}
                                />
                                <span>Popup Button color</span>
                            </LegacyStack>
                        </Button>
                    }
                    onClose={handlePopoverCloseBtnColor}
                >
                    <Popover.Section>
                        <ColorPicker
                            onChange={handleColorChangeBtn}
                            color={colorBtn}
                            allowAlpha
                        />
                    </Popover.Section>
                    <Popover.Section>
                        <TextField value={popupBtnColor} />
                    </Popover.Section>
                </Popover>
            </div>
            <div style={{ marginTop: "7px" }}>
                <Popover
                    active={popoverActiveBg}
                    activator={
                        <Button
                            onClick={handlePopoverOpenBg}
                            fullWidth
                            textAlign="left"
                        >
                            <LegacyStack
                                alignment="center"
                                spacing="tight"
                                sectioned
                            >
                                <div
                                    style={{
                                        height: "2rem",
                                        width: "2rem",
                                        borderRadius: "0.3rem",
                                        background: popupBgColor,
                                        // background:"#000"
                                    }}
                                />
                                <span>Popup Background Color</span>
                            </LegacyStack>
                        </Button>
                    }
                    onClose={handlePopoverCloseBg}
                >
                    <Popover.Section>
                        <ColorPicker
                            onChange={handleColorChangeBg}
                            color={colorBg}
                            allowAlpha
                        />
                    </Popover.Section>
                    <Popover.Section>
                        <TextField value={popupBgColor} />
                    </Popover.Section>
                </Popover>
            </div>
            <div style={{ marginTop: "7px" }}>
                <Popover
                    active={popoverActiveBorder}
                    activator={
                        <Button
                            onClick={handlePopoverOpenBorder}
                            fullWidth
                            textAlign="left"
                        >
                            <LegacyStack
                                alignment="center"
                                spacing="tight"
                                sectioned
                            >
                                <div
                                    style={{
                                        height: "2rem",
                                        width: "2rem",
                                        borderRadius: "0.3rem",
                                        background: popupBorderColor
                                    }}
                                />
                                <span>Popup Border color</span>
                            </LegacyStack>
                        </Button>
                    }
                    onClose={handlePopoverCloseBorder}
                >
                    <Popover.Section>
                        <ColorPicker
                            onChange={handleColorChangeBorder}
                            color={colorBorder}
                            allowAlpha
                        />
                    </Popover.Section>
                    <Popover.Section>
                        <TextField value={popupBorderColor} />
                    </Popover.Section>
                </Popover>
            </div>
        </LegacyCard>
    );
}
function isValueInvalid(content) {
    return !content || content.length < 0;
}
export default function PopupComponent(props) {
    const {
        EditOrderpopupTitle,
        setEditOrderpopupTitle,
        EditOrderpopupButton,
        setEditOrderpopupButton,
        EditOrderpopupTitleColor,
        setEditOrderpopupTitleColor,
        EditOrderpopupBgColor,
        setEditOrderpopupBgColor,
        EditOrderpopupBtnColor,
        setEditOrderpopupBtnColor,
        EditOrderpopupBorderColor,
        setEditOrderpopupBorderColor,
        EditAddresspopupTitle,
        setEditAddresspopupTitle,
        EditAddresspopupButton,
        setEditAddresspopupButton,
        EditAddresspopupTitleColor,
        setEditAddresspopupTitleColor,
        EditAddresspopupBgColor,
        setEditAddresspopupBgColor,
        EditAddresspopupBtnColor,
        setEditAddresspopupBtnColor,
        EditAddresspopupBorderColor,
        setEditAddresspopupBorderColor
    } = props;

    //Edit Order Errors
    const isInvalidEOPopupTitle = isValueInvalid(EditOrderpopupTitle);
    const isInvalidEOPopupBtn = isValueInvalid(setEditOrderpopupButton);

    const errorMessagePopupTitle = isInvalidEOPopupTitle
        ? "Popup Title is Required"
        : "";
    const errorMessagePopupBtn = isInvalidEOPopupBtn
        ? "Popup Button Title is Required"
        : "";

    //Edit Address Errors
    const isInvalidEAPopupTitle = isValueInvalid(EditAddresspopupTitle);
    const isInvalidEAPopupBtn = isValueInvalid(EditAddresspopupButton);

    const errorEAMessagePopupTitle = isInvalidEAPopupTitle
        ? "Popup Title is Required"
        : "";
    const errorEAMessagePopupBtn = isInvalidEAPopupBtn
        ? "Popup Button Title is Required"
        : "";

    return (
            <Frame>
                <hr style={{ marginTop: '25px' }}/>
                <Layout.Section>
                    {/* <LegacyCard title="Popup Configuration" sectioned>
                        <p>
                            To configure the popup, enter the desired title and
                            text to display to customers, and select a color to
                            match your store's branding.
                        </p>
                    </LegacyCard> */}
                    <Text variant="headingMd" as="h2">Popup Configuration</Text>
                        <p>
                        To configure the popup, enter the desired title and text to display to customers,
                        and select a color to match your store's branding.
                        </p>
                </Layout.Section>
                <Layout.AnnotatedSection
                    title="Edit Order"
                >
                    <FormLayout>
                        {/* Edit Order  */}
                        <PopupSection
                            popupTitle={EditOrderpopupTitle}
                            setpopupTitle={setEditOrderpopupTitle}
                            popupTitleErrorMsg={errorMessagePopupTitle}
                            popupButton={EditOrderpopupButton}
                            setpopupButton={setEditOrderpopupButton}
                            popupBtnTitleErrorMsg={errorMessagePopupBtn}
                            popupTitleColor={EditOrderpopupTitleColor}
                            setpopupTitleColor={setEditOrderpopupTitleColor}
                            popupBgColor={EditOrderpopupBgColor}
                            setpopupBgColor={setEditOrderpopupBgColor}
                            popupBtnColor={EditOrderpopupBtnColor}
                            setpopupBtnColor={setEditOrderpopupBtnColor}
                            popupBorderColor={EditOrderpopupBorderColor}
                            setpopupBorderColor={setEditOrderpopupBorderColor}
                        />
                    </FormLayout>
                </Layout.AnnotatedSection>

                <Layout.AnnotatedSection
                    title="Edit Address"
                >
                    <FormLayout>
                        {/* Edit Order  */}
                        <PopupSection
                            popupTitle={EditAddresspopupTitle}
                            setpopupTitle={setEditAddresspopupTitle}
                            popupTitleErrorMsg={errorEAMessagePopupTitle}
                            popupButton={EditAddresspopupButton}
                            setpopupButton={setEditAddresspopupButton}
                            popupBtnTitleErrorMsg={errorEAMessagePopupBtn}
                            popupTitleColor={EditAddresspopupTitleColor}
                            setpopupTitleColor={setEditAddresspopupTitleColor}
                            popupBgColor={EditAddresspopupBgColor}
                            setpopupBgColor={setEditAddresspopupBgColor}
                            popupBtnColor={EditAddresspopupBtnColor}
                            setpopupBtnColor={setEditAddresspopupBtnColor}
                            popupBorderColor={EditAddresspopupBorderColor}
                            setpopupBorderColor={setEditAddresspopupBorderColor}
                        />
                    </FormLayout>
                </Layout.AnnotatedSection>
            </Frame>
    );
}

import {
    FormLayout,
    TextField,
    Text,
    InlineError,
    Layout,
    Frame,
    LegacyCard,
    Popover,
    Button,
    LegacyStack,
    ColorPicker,
    hsbToHex,
    Divider
} from "@shopify/polaris";
import { useCallback, useState } from "react";

function ButtonConfigurationSection({
    title,
    setTitle,
    bgColor,
    setBgColor,
    textColor,
    setTextColor,
    titleError,
    titleErrorMsg
}) {
    const [popoverActiveBg, setPopoverActiveBg] = useState(false);
    const [popoverActiveTextColor, setPopoverActiveTextColor] = useState(false);
    const [colorBg, setColorBg] = useState({
        hue: 240,
        brightness: 1,
        saturation: 1,
    });
    const [colorText, setColorText] = useState({
        hue: 120,
        brightness: 1,
        saturation: 1,
    });

    const handleColorChangeBg = useCallback((color) => {
        setBgColor(hsbToHex(color));
        setColorBg(color);
    }, [setBgColor]);

    const handleColorChangeText = useCallback((color) => {
        setTextColor(hsbToHex(color));
        setColorText(color);
    }, [setTextColor]);

    const handlePopoverCloseBg = useCallback(() => setPopoverActiveBg(false), []);
    const handlePopoverOpenBg = useCallback(() => setPopoverActiveBg(true), []);

    const handlePopoverCloseTextColor = useCallback(() => setPopoverActiveTextColor(false), []);
    const handlePopoverOpenTextColor = useCallback(() => setPopoverActiveTextColor(true), []);

    const handleChangeTitle = useCallback((val) => setTitle(String(val)), [setTitle]);

    return (
        <FormLayout>
            <LegacyCard sectioned>
                <TextField
                    label="Button Title"
                    value={title}
                    onChange={handleChangeTitle}
                    autoComplete="off"
                    type="text"
                    error={titleError}
                />
                <div style={{ marginTop: '5px' }}>
                    <InlineError message={titleErrorMsg} />
                </div>
                <div style={{ marginTop: '7px' }}>
                    <Popover
                        active={popoverActiveBg}
                        activator={<Button onClick={handlePopoverOpenBg} fullWidth textAlign="left">
                            <LegacyStack alignment="center" spacing="tight" sectioned>
                                <div
                                    style={{
                                        height: "2rem",
                                        width: "2rem",
                                        borderRadius: "0.3rem",
                                        background: bgColor
                                    }}
                                />
                                <span>Button Background Color</span>
                            </LegacyStack>
                        </Button>}
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
                            <TextField value={bgColor} />
                        </Popover.Section>
                    </Popover>
                </div>
                <div style={{ marginTop: '7px' }}>
                    <Popover
                        active={popoverActiveTextColor}
                        activator={<Button onClick={handlePopoverOpenTextColor} fullWidth textAlign="left">
                            <LegacyStack alignment="center" spacing="tight">
                                <div
                                    style={{
                                        height: "2rem",
                                        width: "2rem",
                                        borderRadius: "0.3rem",
                                        background: textColor
                                    }}
                                />
                                <span>Button Text Color</span>
                            </LegacyStack>
                        </Button>}
                        onClose={handlePopoverCloseTextColor}
                    >
                        <Popover.Section>
                            <ColorPicker
                                onChange={handleColorChangeText}
                                color={colorText}
                                allowAlpha
                            />
                        </Popover.Section>
                        <Popover.Section>
                            <TextField value={textColor} />
                        </Popover.Section>
                    </Popover>
                </div>
            </LegacyCard>
        </FormLayout>
    );
}

export default function ButtonConfiguration(props) {
    const {
        EditOrderBtnTitle, setEditOrderBtnTitle, EditOrderBtnBgColor, setEditOrderBtnBgColor, EditOrderBtnTextColor, setEditOrderBtnTextColor,
        EditAddressBtnTitle, setEditAddressBtnTitle, EditAddressBtnBgColor, setEditAddressBtnBgColor, EditAddressBtnTextColor, setEditAddressBtnTextColor,
        AddItemsBtnTitle, setAddItemsBtnTitle, AddItemsBtnBgColor, setAddItemsBtnBgColor, AddItemsBtnTextColor, setAddItemsBtnTextColor
    } = props;

    const isInvalidEditOrderBtnTitle = isValueInvalid(EditOrderBtnTitle);
    const isInvalidEditAddressBtnTitle = isValueInvalid(EditAddressBtnTitle);

    const errorMessageEditOrderBtnTitle = isInvalidEditOrderBtnTitle
        ? 'Edit Order Button Title is Required'
        : '';
    const errorMessageEditAddressBtnTitle = isInvalidEditAddressBtnTitle
        ? 'Edit Address Button Title is Required'
        : '';

    function isValueInvalid(content) {
        return !content || content.length < 0;
    }

    return (
        <Frame>
                <hr style={{ marginTop: '25px' }}/>
                    <Layout.Section>
                        {/* <LegacyCard title="Button Configuration" sectioned>
                            <p>
                                Please enter the desired text for different kind of title,
                                as you want them to appear on your Edit Order.
                            </p>
                        </LegacyCard> */}
                        <Text variant="headingMd" as="h2">Button Configuration</Text>
                        <p>
                            Please enter the desired text for different kind of title,
                            as you want them to appear on your Edit Order.
                        </p>
                    </Layout.Section>
                <Layout.AnnotatedSection title="Edit Order Configuration">
                    <FormLayout>
                        <ButtonConfigurationSection
                            title={EditOrderBtnTitle}
                            setTitle={setEditOrderBtnTitle}
                            bgColor={EditOrderBtnBgColor}
                            setBgColor={setEditOrderBtnBgColor}
                            textColor={EditOrderBtnTextColor}
                            setTextColor={setEditOrderBtnTextColor}
                            titleError={isInvalidEditOrderBtnTitle}
                            titleErrorMsg={errorMessageEditOrderBtnTitle}
                        />
                    </FormLayout>
                </Layout.AnnotatedSection>
                <Layout.AnnotatedSection title="Edit Address Configuration">
                    <FormLayout>
                        <ButtonConfigurationSection
                            title={EditAddressBtnTitle}
                            setTitle={setEditAddressBtnTitle}
                            bgColor={EditAddressBtnBgColor}
                            setBgColor={setEditAddressBtnBgColor}
                            textColor={EditAddressBtnTextColor}
                            setTextColor={setEditAddressBtnTextColor}
                            titleError={isInvalidEditAddressBtnTitle}
                            titleErrorMsg={errorMessageEditAddressBtnTitle}
                        />
                    </FormLayout>
                </Layout.AnnotatedSection>
                <Layout.AnnotatedSection title="Add Items Configuration">
                    <FormLayout>
                        <ButtonConfigurationSection
                            title={AddItemsBtnTitle}
                            setTitle={setAddItemsBtnTitle}
                            bgColor={AddItemsBtnBgColor}
                            setBgColor={setAddItemsBtnBgColor}
                            textColor={AddItemsBtnTextColor}
                            setTextColor={setAddItemsBtnTextColor}
                            titleError={isInvalidEditAddressBtnTitle}
                            titleErrorMsg={errorMessageEditAddressBtnTitle}
                        />
                    </FormLayout>
                </Layout.AnnotatedSection>
        </Frame>
    );
}

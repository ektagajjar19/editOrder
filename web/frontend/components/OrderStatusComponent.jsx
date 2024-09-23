import {
    FormLayout,
    Layout,
    LegacyCard,
    Select,
    SettingToggle,
    Frame
} from "@shopify/polaris";
import { useCallback} from "react";

export default function OrderStatusComponent(props) {
    const {
        orderDetailCheckoutLayoutAlignment,
        setOrderDetailCheckoutLayoutAlignment,
        OSEditOrderBtnVisibility,
        OSEditAddressBtnVisibility,
        OSAddItemBtnVisibility,
        setOSEditOrderBtnVisibility,
        setOSEditAddressBtnVisibility,
        setOSAddItemBtnVisibility,
    } = props;
    const handleSelectChange = useCallback((value) => setOrderDetailCheckoutLayoutAlignment(value));
    const options = [
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
        { label: 'Left', value: 'left' },
    ];

    //Edit Order
    const handleToggle = useCallback(() => setOSEditOrderBtnVisibility((OSEditOrderBtnVisibility) => !OSEditOrderBtnVisibility), []);
    const contentStatus = OSEditOrderBtnVisibility ? 'Disable' : 'Enable';
    const textStatus = OSEditOrderBtnVisibility ? 'enabled' : 'disabled';

    //Edit Address
    const EAhandleToggle = useCallback(() => setOSEditAddressBtnVisibility((OSEditAddressBtnVisibility) => !OSEditAddressBtnVisibility), []);
    const EAcontentStatus = OSEditAddressBtnVisibility ? 'Disable' : 'Enable';
    const EAtextStatus = OSEditAddressBtnVisibility ? 'enabled' : 'disabled';

    //Add Items
    const AIhandleToggle = useCallback(() => setOSAddItemBtnVisibility((OSAddItemBtnVisibility) => !OSAddItemBtnVisibility), []);
    const AIcontentStatus = OSAddItemBtnVisibility ? 'Disable' : 'Enable';
    const AItextStatus = OSAddItemBtnVisibility ? 'enabled' : 'disabled';
    return (
            <Layout.AnnotatedSection
                title="Order Status Configuration"
                description="The order status configuration allows you to customize
                            the layout of the order status page in your store."
            >
                <FormLayout>
                    <LegacyCard sectioned>
                        <Select
                            label="Layout Alignment"
                            options={options}
                            onChange={handleSelectChange}
                            value={orderDetailCheckoutLayoutAlignment}
                        />
                        <div style={{ marginTop: '10px' }}></div>
                        <SettingToggle
                            action={{
                                content: contentStatus,
                                onAction: handleToggle,
                            }}
                            enabled={OSEditOrderBtnVisibility}
                            style={{ marginTop: '10px' }}
                        >Show Edit Order Button in Order Status page is {' '}<b>{textStatus}</b>.
                        </SettingToggle>
                        <SettingToggle
                            action={{
                                content: EAcontentStatus,
                                onAction: EAhandleToggle,
                            }}
                            enabled={OSEditAddressBtnVisibility}
                            style={{ marginTop: '10px' }}
                        >Show Edit Address Button in Order Status page is {' '}<b>{EAtextStatus}</b>.
                        </SettingToggle>
                        <SettingToggle
                            action={{
                                content: AIcontentStatus,
                                onAction: AIhandleToggle,
                            }}
                            enabled={OSAddItemBtnVisibility}
                            style={{ marginTop: '10px' }}
                        >Show Add Item(s) Button in Order Status page is {' '}<b>{AItextStatus}</b>.
                        </SettingToggle>
                    </LegacyCard>
                </FormLayout>
            </Layout.AnnotatedSection>
    );
}

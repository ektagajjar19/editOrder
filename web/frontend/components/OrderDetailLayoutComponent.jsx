import {
    FormLayout,
    Layout,
    LegacyCard,
    Select,
    SettingToggle,
    Frame
} from "@shopify/polaris";
import { useCallback} from "react";

export default function OrderDetailLayoutComponent(props) {
    const {
        orderDetailLayoutAlignment,
        setOrderDetailLayoutAlignment,
        EditOrderBtnVisibility,
        EditAddressBtnVisibility,
        AddItemBtnVisibility,
        setEditOrderBtnVisibility,
        setEditAddressBtnVisibility,
        setAddItemBtnVisibility,
    } = props;
    const handleSelectChange = useCallback((value) => setOrderDetailLayoutAlignment(value));
    const options = [
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
        { label: 'Left', value: 'left' },
    ];

    //Edit Order
    const handleToggle = useCallback(() => setEditOrderBtnVisibility((EditOrderBtnVisibility) => !EditOrderBtnVisibility), []);
    const contentStatus = EditOrderBtnVisibility ? 'Disable' : 'Enable';
    const textStatus = EditOrderBtnVisibility ? 'enabled' : 'disabled';

    //Edit Address
    const EAhandleToggle = useCallback(() => setEditAddressBtnVisibility((EditAddressBtnVisibility) => !EditAddressBtnVisibility), []);
    const EAcontentStatus = EditAddressBtnVisibility ? 'Disable' : 'Enable';
    const EAtextStatus = EditAddressBtnVisibility ? 'enabled' : 'disabled';

    //Add Items
    const AIhandleToggle = useCallback(() => setAddItemBtnVisibility((AddItemBtnVisibility) => !AddItemBtnVisibility), []);
    const AIcontentStatus = AddItemBtnVisibility ? 'Disable' : 'Enable';
    const AItextStatus = AddItemBtnVisibility ? 'enabled' : 'disabled';
    return (
            <Layout.AnnotatedSection
                title="Order Detail Layout Configuration"
                description="The order detail layout configuration allows you
                             to customize the layout of the order details page in your store."
            >
                <FormLayout>
                    <LegacyCard sectioned>
                        <Select
                            label="Layout Alignment"
                            options={options}
                            onChange={handleSelectChange}
                            value={orderDetailLayoutAlignment}
                        />
                        <div style={{ marginTop: '10px' }}></div>
                        <SettingToggle
                            action={{
                                content: contentStatus,
                                onAction: handleToggle,
                            }}
                            enabled={EditOrderBtnVisibility}
                            style={{ marginTop: '10px' }}
                        >Show Edit Order Button in Checkout page is {' '}<b>{textStatus}</b>.
                        </SettingToggle>
                        <SettingToggle
                            action={{
                                content: EAcontentStatus,
                                onAction: EAhandleToggle,
                            }}
                            enabled={EditAddressBtnVisibility}
                            style={{ marginTop: '10px' }}
                        >Show Edit Address Button in Checkout page is {' '}<b>{EAtextStatus}</b>.
                        </SettingToggle>
                        <SettingToggle
                            action={{
                                content: AIcontentStatus,
                                onAction: AIhandleToggle,
                            }}
                            enabled={AddItemBtnVisibility}
                            style={{ marginTop: '10px' }}
                        >Show Add Item(s) Button in Checkout page is {' '}<b>{AItextStatus}</b>.
                        </SettingToggle>
                    </LegacyCard>
                </FormLayout>
            </Layout.AnnotatedSection>
    );
}

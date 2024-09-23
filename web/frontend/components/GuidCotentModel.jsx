import {
    Modal,
    TextContainer,
    Link
} from "@shopify/polaris";
export default function GuidCotentModel(props) {

    const { isModalOpen, setIsModalOpen } = props;

    const closeModal = () => {
        setIsModalOpen(false);
        localStorage.setItem('hasClosedPopup', true);
    };

    return (
        <Modal
            open={isModalOpen}
            onClose={closeModal}
            title="Get Started with Easy Edit Order App"
            primaryAction={{
                content: 'Got it',
                onAction: closeModal,
            }}
        >
            <Modal.Section>
                <TextContainer>
                    <strong>Welcome to the Edit Order App! To get started, simply instructions for using our app:</strong>
                    <ul>
                        <li>
                            To enable the app's features on the frontend,
                            click on the "Enable APP" button located at the top right-hand corner.
                            You will be redirected to the theme's App embeds section,
                            where you can activate the "Edit Order App" setting.
                        </li>
                        <li>
                            In the General Section, you can configure the Message customization, Button configuration, and Popup configuration to match your store's branding.
                        </li>
                        <li>
                            In the Settings Section, you can configure the Time Limit Settings, Tag manage, Restock/Refund , Alignment, and enable/disable buttons in Order Status, Thank You, and Order Detail pages.
                        </li>
                    </ul>
                    <p>If you require any assistance or wish to provide feedback, please do not hesitate to contact us at <Link url="mailto:support@atharvasystem.com">support@atharvasystem.com</Link>. Your feedback can help us improve our app and provide a better experience to our users.</p>
                    <br/>
                    <b>Kindly note that our app editing only UNFULFILLED status orders.
                    </b>
                </TextContainer>
            </Modal.Section>
        </Modal>
    );
}

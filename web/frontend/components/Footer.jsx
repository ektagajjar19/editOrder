import { useState, useCallback } from "react";
import {
    FooterHelp,
    Link
} from "@shopify/polaris";

export default function FooterAction() {
    return (
        <FooterHelp>
            Need help? {' '}
            <Link url="mailto:support@atharvasystem.com">
                Contact us
            </Link>
            {' '} for assistance and feedback. Your feedback can help us for improvement our app.
        </FooterHelp>
    )
}

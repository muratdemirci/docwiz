import React from 'react'
import { Text, useTheme } from "@geist-ui/react";

const NotFoundPage = () => {
    const { palette } = useTheme();

    return (
        <div className="condiv">
            <Text h1 style={{ color: palette.violet }}>
                404
            </Text>
            <Text h2 style={{ color: palette.violetLighter }}>
                Bu sayfa bulunamadı.
            </Text>
        </div>
    )
}

export default NotFoundPage;
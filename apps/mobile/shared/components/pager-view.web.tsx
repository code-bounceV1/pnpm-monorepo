import React, { forwardRef, useImperativeHandle, useState } from "react";
import { View } from "react-native";

const PagerView = forwardRef(({ children, style, initialPage = 0 }: any, ref) => {
    const [currentPage, setCurrentPage] = useState(initialPage);

    useImperativeHandle(ref, () => ({
        setPage: (page: number) => {
            setCurrentPage(page);
        },
        setPageWithoutAnimation: (page: number) => {
            setCurrentPage(page);
        },
        setScrollEnabled: (scrollEnabled: boolean) => { },
    }));

    const childrenArray = React.Children.toArray(children);

    return (
        <View style={style}>
            {childrenArray.map((child, index) => (
                <View
                    key={index}
                    style={[
                        { flex: 1 },
                        index !== currentPage ? { display: "none" } : {}
                    ]}
                >
                    {child}
                </View>
            ))}
        </View>
    );
});

export default PagerView;

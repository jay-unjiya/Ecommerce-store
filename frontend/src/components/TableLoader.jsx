import React from 'react';
import '../scss/TableLoader.scss';

const TableLoader = ({ rowsCount = 8 }) => {
    return (
        <table className="skeleton-loader">
            <tbody>
                {[...Array(rowsCount)].map((_, index) => (
                    <tr key={index}>
                        <td className="td-title"><span></span></td>
                        <td className="td-image"><span></span></td>
                        <td className="td-price"><span></span></td>
                        <td className="td-description"><span></span></td>
                        <td className="td-category"><span></span></td>
                        <td className="td-actions"><span></span></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TableLoader;
import React from 'react';

import '../styles/layout.css';

function MyApp({ Component, pageProps }) {
    return (
        <>
        <div className="layout">
            <header>
                <img src="/logo.png" alt="Logo" className="logo" style={{ width: '100px', height: 'auto' }} />
            </header>
            <main>
                <Component {...pageProps} />
            </main>
        </div>
        </>
    );
}

export default MyApp;
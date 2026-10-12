function TemplateLayout({ children, onNavigate }) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <div style={layoutStyles.container}>
            {/* ВЕРХНЯЯ ШАПКА */}
            <div style={layoutStyles.headerContainer}>
                <div style={layoutStyles.leftSide} onClick={() => onNavigate('home')}>
                    <img src="src/media/black-logo.png" alt="REC CHURCH" style={layoutStyles.logoImg} />
                    <div style={layoutStyles.titleBlock}>
                        <span style={layoutStyles.mainTitle}>ПРИМИРЕНИЕ</span>
                        <span style={layoutStyles.subTitle}>ЦЕРКОВЬ</span>
                    </div>
                </div>

                <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={layoutStyles.menuButton}>
                    <div style={layoutStyles.bar}></div>
                    <div style={layoutStyles.bar}></div>
                    <div style={layoutStyles.bar}></div>
                </button>
            </div>

            {/* ВНУТРЕННИЙ УНИКАЛЬНЫЙ КОНТЕНТ ШАБЛОНА */}
            <div style={layoutStyles.contentSection}>
                {children}
            </div>

            {/* НИЖНЯЯ НАВИГАЦИЯ */}
            <div style={layoutStyles.navCard}>
                <div style={layoutStyles.leftSide} onClick={() => onNavigate('home')}>
                    <img src="src/media/black-logo.png" alt="REC CHURCH" style={layoutStyles.logoImg} />
                    <div style={layoutStyles.titleBlock}>
                        <span style={layoutStyles.mainTitle}>ПРИМИРЕНИЕ</span>
                        <span style={layoutStyles.subTitle}>ЦЕРКОВЬ</span>
                    </div>
                </div>
                <div style={layoutStyles.divider}></div>
                <div style={{ color: '#70778A', fontSize: '13px', fontWeight: '600' }}>Интернациональная церковь</div>
            </div>
        </div>
    );
}

const layoutStyles = {
    container: { display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px', margin: '0 auto' },
    headerContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1.5px solid #d0d7de', borderRadius: '25px', padding: '10px 16px' },
    leftSide: { display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' },
    logoImg: { height: '36px', objectFit: 'contain' },
    titleBlock: { display: 'flex', flexDirection: 'column', lineHeight: '1.1' },
    mainTitle: { fontWeight: '700', fontSize: '16px', color: '#000' },
    subTitle: { fontWeight: '500', fontSize: '16px', color: '#000' },
    menuButton: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' },
    bar: { width: '30px', height: '6px', backgroundColor: '#3390EC', borderRadius: '5px' },
    contentSection: { background: '#fff', border: '1.5px solid #d0d7de', borderRadius: '20px', padding: '20px 16px' },
    navCard: { background: '#fff', border: '1.5px solid #d0d7de', borderRadius: '25px', padding: '20px' },
    divider: { width: '100%', height: '1px', backgroundColor: '#e1e4e8', margin: '16px 0' }
};
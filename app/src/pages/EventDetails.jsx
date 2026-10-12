import React, { useState } from 'react';

/**
 * Структура объекта event, поддерживаемая компонентом:
 * event = {
 *   id: '1',
 *   category: 'sunday_service', // 'standard' | 'broadcast' | 'home_group' | 'sunday_service'
 *   title: 'Воскресное собрание',
 *   imageUrl: 'src/media/ads/prayer_ru.jpg',
 *   description: 'Приглашаем всех на наше воскресное богослужение...',
 *   date: '2026-10-15',        // YYYY-MM-DD или ISO
 *   time: '11:00',
 *   location: 'Зал "Европа"',
 *   speaker: 'Пастор Иван Иванов', // Доп. поле: спикер/проповедник/ведущий
 *   price: 'Вход свободный',      // Доп. поле: стоимость или условие входа
 *   registrationUrl: 'https://...', // Доп. поле: ссылка на регистрацию
 *   streamUrl: 'https://youtube.com/live/...', // Ссылка на трансляцию
 *   homeGroups: [                // Список домашних групп
 *     { id: 1, name: 'Домашняя группа у Василия', status: 'scheduled' }, // 'scheduled' | 'canceled'
 *     { id: 2, name: 'Домашняя группа в "STUDIO"', status: 'scheduled' },
 *   ],
 *   chatLinks: [                 // Ссылки на чаты
 *     { label: 'Чат группы Василия', url: 'https://t.me/...' },
 *     { label: 'Общий чат домашних групп', url: 'https://t.me/...' }
 *   ]
 * }
 */

export function EventDetails({ event, onNavigate }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (!event) {
        return (
            <div style={styles.container}>
                <button onClick={() => onNavigate('events')} style={styles.backButton}>
                    ← Назад к событиям
                </button>
                <div style={styles.contentSection}>
                    <p style={{ textAlign: 'center', padding: '20px', color: '#70778A', margin: 0 }}>
                        Событие не найдено или было удалено.
                    </p>
                </div>
            </div>
        );
    }

    // Безопасное форматирование даты из YYYY-MM-DD (или ISO) в русский вид
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const cleanDate = dateString.split('T')[0];
        const parts = cleanDate.split('-');
        
        if (parts.length === 3) {
            const [year, month, day] = parts.map(Number);
            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                const dateObj = new Date(year, month - 1, day);
                return dateObj.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            }
        }
        return dateString;
    };

    // Определение типа события
    const broadcastCategories = ['broadcast', 'sunday_service', 'Easter', 'christmas', 'hb_rec_church'];
    const broadcastTitles = ['воскресное собрание', 'пасха', 'рождество', 'день рождения церкви'];

    const isBroadcastEvent =
        Boolean(event.streamUrl) ||
        broadcastCategories.includes(event.category) ||
        broadcastTitles.some((t) => event.title?.toLowerCase().includes(t));

    const isHomeGroupEvent =
        ['home_group', 'home_groups'].includes(event.category) ||
        event.title?.toLowerCase().includes('домашняя группа') ||
        Boolean(event.homeGroups && event.homeGroups.length > 0) ||
        Boolean(event.chatLinks && event.chatLinks.length > 0);

    return (
        <div style={styles.container}>
            {/* 1. ШАПКА (Лого + Меню) */}
            <div style={headerStyles.headerWrapper}>
                <div style={headerStyles.headerContainer}>
                    <div style={headerStyles.leftSide} onClick={() => onNavigate('home')}>
                        <img
                            src="src/media/black-logo.png"
                            alt="REC CHURCH"
                            style={headerStyles.logoImg}
                        />
                        <div style={headerStyles.titleBlock}>
                            <span style={headerStyles.mainTitle}>ПРИМИРЕНИЕ</span>
                            <span style={headerStyles.subTitle}>ЦЕРКОВЬ</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={headerStyles.menuButton}
                        aria-label="Меню"
                    >
                        <div style={headerStyles.bar}></div>
                        <div style={headerStyles.bar}></div>
                        <div style={headerStyles.bar}></div>
                    </button>
                </div>

                {isMenuOpen && (
                    <div style={headerStyles.dropdownMenu}>
                        <div style={headerStyles.dropdownHeader}>Навигация</div>
                        {[
                            { key: 'about', label: 'О церкви' },
                            { key: 'events', label: 'События' },
                            { key: 'communication', label: 'Общение' },
                            { key: 'ministries', label: 'Наши служения' },
                            { key: 'team', label: 'Команда' },
                            { key: 'baptism', label: 'Крещение' }
                        ].map((item) => (
                            <div
                                key={item.key}
                                style={headerStyles.dropdownItem}
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    onNavigate(item.key);
                                }}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 2. КНОПКА ВОЗВРАТА */}
            <button onClick={() => onNavigate('events')} style={styles.backButton}>
                ← Назад к событиям
            </button>

            {/* ОСНОВНОЙ КОНТЕНТ СОБЫТИЯ */}
            <div style={styles.contentSection}>
                <h2 style={styles.sectionTitle}>{event.title}</h2>

                {/* 3. ИЗОБРАЖЕНИЕ СОБЫТИЯ */}
                {(event.imageUrl || event.image) && (
                    <div style={styles.imageWrapper}>
                        <img
                            src={event.imageUrl || event.image}
                            alt={event.title}
                            style={styles.contentImage}
                        />
                    </div>
                )}

                {/* 4. ТЕКСТОВОЕ ОПИСАНИЕ */}
                {event.description && (
                    <div style={styles.textContainer}>
                        <p style={styles.paragraph}>{event.description}</p>
                    </div>
                )}

                {/* 5. СПИШЕР / ВЕДУЩИЙ (если указан) */}
                {(event.speaker || event.pastor || event.organizer) && (
                    <div style={styles.infoRow}>
                        <span style={styles.fieldLabel}>👤 Ведущий / Спикер:</span>
                        <span style={styles.fieldValue}>
                            {event.speaker || event.pastor || event.organizer}
                        </span>
                    </div>
                )}

                {/* 6. ПРЯМАЯ ТРАНСЛЯЦИЯ (если доступна) */}
                {isBroadcastEvent && event.streamUrl && (
                    <div style={styles.broadcastBlock}>
                        <span style={styles.fieldLabel}>📺 Прямая трансляция:</span>
                        <a
                            href={event.streamUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.streamLink}
                        >
                            Смотреть онлайн →
                        </a>
                    </div>
                )}

                {/* 7. ДОМАШНИЕ ГРУППЫ И ЧАТЫ */}
                {isHomeGroupEvent && (
                    <div style={styles.homeGroupsCard}>
                        <span style={styles.fieldLabel}>Группы и статусы:</span>
                        
                        {event.homeGroups && event.homeGroups.length > 0 ? (
                            <div style={styles.groupsList}>
                                {event.homeGroups.map((group) => (
                                    <div key={group.id || group.name} style={styles.groupRow}>
                                        <span style={styles.groupName}>{group.name}</span>
                                        <span
                                            style={{
                                                ...styles.statusBadge,
                                                backgroundColor: group.status === 'canceled' ? '#FFEBEE' : '#E8F5E9',
                                                color: group.status === 'canceled' ? '#C62828' : '#2E7D32',
                                            }}
                                        >
                                            {group.status === 'canceled' ? 'Отменена' : 'Запланирована'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={styles.subText}>Информация о группах уточняется.</p>
                        )}

                        {/* Ссылки на чаты */}
                        {event.chatLinks && event.chatLinks.length > 0 && (
                            <div style={styles.chatsContainer}>
                                <span style={styles.subLabel}>Чаты для связи:</span>
                                {event.chatLinks.map((chat, idx) => (
                                    <a
                                        key={idx}
                                        href={chat.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={styles.chatButton}
                                    >
                                        💬 {chat.label || 'Чат Telegram'}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 8. МЕСТО ПРОВЕДЕНИЯ */}
                {(event.location || event.address) && (
                    <div style={styles.infoRow}>
                        <span style={styles.fieldLabel}>📍 Место проведения:</span>
                        <span style={styles.fieldValue}>{event.location || event.address}</span>
                    </div>
                )}

                {/* 9. ДАТА И ВРЕМЯ */}
                {(event.date || event.time) && (
                    <div style={styles.infoRow}>
                        <span style={styles.fieldLabel}>📅 Дата и время:</span>
                        <span style={styles.fieldValue}>
                            {formatDate(event.date)} {event.time && `в ${event.time}`}
                        </span>
                    </div>
                )}

                {/* 10. СТОИМОСТЬ / ВХОД (если указано) */}
                {(event.price || event.cost) && (
                    <div style={styles.infoRow}>
                        <span style={styles.fieldLabel}>💳 Условия входа:</span>
                        <span style={styles.fieldValue}>{event.price || event.cost}</span>
                    </div>
                )}

                {/* 11. КНОПКА РЕГИСТРАЦИИ (если есть ссылка) */}
                {(event.registrationUrl || event.registerUrl) && (
                    <a
                        href={event.registrationUrl || event.registerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.registerButton}
                    >
                        Записаться / Зарегистрироваться →
                    </a>
                )}
            </div>

            {/* 12. НИЖНЯЯ НАВИГАЦИЯ */}
            <div style={styles.navCard}>
                <div style={styles.leftSideNav} onClick={() => onNavigate('home')}>
                    <img
                        src="src/media/black-logo.png"
                        alt="REC CHURCH"
                        style={styles.logoImg}
                    />
                    <div style={styles.titleBlock}>
                        <span style={styles.mainTitle}>ПРИМИРЕНИЕ</span>
                        <span style={styles.subTitle}>ЦЕРКОВЬ</span>
                    </div>
                </div>

                <div style={styles.divider}></div>

                <table style={styles.table}>
                    <tbody>
                        <tr>
                            <td style={styles.navtextInt}>
                                Интернациональная церковь
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.navText}>
                                Навигация
                            </td>
                        </tr>
                        {[
                            { key: 'about', label: 'О церкви' },
                            { key: 'events', label: 'События' },
                            { key: 'communication', label: 'Общение' },
                            { key: 'ministries', label: 'Наши служения' },
                            { key: 'team', label: 'Команда' },
                            { key: 'baptism', label: 'Крещение', isLast: true }
                        ].map((linkItem) => (
                            <tr key={linkItem.key}>
                                <td style={linkItem.isLast ? styles.tableCellLast : styles.tableCell}>
                                    <a
                                        href={`#${linkItem.key}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onNavigate(linkItem.key);
                                        }}
                                        style={styles.link}
                                    >
                                        {linkItem.label}
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Стили шапки
const headerStyles = {
    headerWrapper: {
        position: 'relative',
        zIndex: 100,
    },
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ffffff',
        border: '1.5px solid #d0d7de',
        borderRadius: '25px',
        padding: '10px 16px',
    },
    leftSide: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
    },
    logoImg: {
        height: '36px',
        objectFit: 'contain',
    },
    titleBlock: {
        display: 'flex',
        flexDirection: 'column',
        lineHeight: '1.1',
    },
    mainTitle: {
        fontWeight: '700',
        fontSize: '16px',
        color: '#000000',
    },
    subTitle: {
        fontWeight: '500',
        fontSize: '16px',
        color: '#000000',
    },
    menuButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '6px',
    },
    bar: {
        width: '30px',
        height: '6px',
        backgroundColor: '#3390EC',
        borderRadius: '5px',
    },
    dropdownMenu: {
        position: 'absolute',
        top: '60px',
        right: '0',
        width: '200px',
        background: '#ffffff',
        border: '1.5px solid #d0d7de',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '8px 0',
        zIndex: 100,
    },
    dropdownHeader: {
        padding: '6px 16px',
        fontSize: '11px',
        fontWeight: '700',
        color: '#70778A',
        textTransform: 'uppercase',
    },
    dropdownItem: {
        padding: '10px 16px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#1C1E26',
        cursor: 'pointer',
        borderTop: '1px solid #F3F4F8',
    },
};

// Стили контента и навигационной карточки
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
    },
    backButton: {
        alignSelf: 'flex-start',
        background: 'none',
        border: 'none',
        color: '#3390EC',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        padding: '4px 0',
    },
    contentSection: {
        background: '#ffffff',
        border: '1.5px solid #d0d7de',
        borderRadius: '25px',
        padding: '20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '700',
        letterSpacing: '0.5px',
        color: '#1C1E26',
        margin: 0,
        paddingBottom: '4px',
        borderBottom: '2px solid #3390EC',
        display: 'inline-block',
    },
    imageWrapper: {
        width: '100%',
        height: '180px',
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#F7F8FC',
        border: '1.5px solid #d0d7de',
    },
    contentImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    paragraph: {
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#1C1E26',
        margin: 0,
        whiteSpace: 'pre-line',
    },
    broadcastBlock: {
        background: '#F7F8FC',
        border: '1px solid #E8EAF2',
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    streamLink: {
        color: '#3390EC',
        fontWeight: '600',
        fontSize: '14px',
        textDecoration: 'none',
    },
    homeGroupsCard: {
        background: '#F7F8FC',
        border: '1px solid #E8EAF2',
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    groupsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    groupRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 0',
        borderBottom: '1px dashed #E1E4E8',
    },
    groupName: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#1C1E26',
    },
    statusBadge: {
        fontSize: '11px',
        fontWeight: '700',
        padding: '3px 8px',
        borderRadius: '10px',
    },
    chatsContainer: {
        marginTop: '6px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    subLabel: {
        fontSize: '12px',
        color: '#70778A',
        fontWeight: '600',
    },
    subText: {
        fontSize: '13px',
        color: '#70778A',
        margin: 0,
    },
    chatButton: {
        fontSize: '13px',
        color: '#3390EC',
        fontWeight: '600',
        textDecoration: 'none',
    },
    infoRow: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    fieldLabel: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#70778A',
    },
    fieldValue: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#1C1E26',
    },
    registerButton: {
        display: 'block',
        textAlign: 'center',
        backgroundColor: '#3390EC',
        color: '#FFFFFF',
        padding: '12px 16px',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '14px',
        textDecoration: 'none',
        marginTop: '8px',
    },
    navCard: {
        background: '#fff',
        padding: '20px',
        borderRadius: '25px',
        border: '1.5px solid #d0d7de',
    },
    leftSideNav: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
    },
    logoImg: {
        height: '36px',
        objectFit: 'contain',
    },
    titleBlock: {
        display: 'flex',
        flexDirection: 'column',
        lineHeight: '1.1',
    },
    mainTitle: {
        fontWeight: '700',
        fontSize: '16px',
        color: '#000000',
    },
    subTitle: {
        fontWeight: '500',
        fontSize: '16px',
        color: '#000000',
    },
    divider: {
        width: '100%',
        height: '1px',
        backgroundColor: '#e1e4e8',
        margin: '16px 0',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    navtextInt: {
        padding: '10px 0 10px',
        color: '#70778A',
        fontWeight: '600',
        fontSize: '16px',
        display: 'block',
    },
    navText: {
        padding: '10px 0 10px',
        color: '#1C1E26',
        fontWeight: '600',
        fontSize: '16px',
        display: 'block',
    },
    tableCell: {
        padding: '3px 0',
    },
    tableCellLast: {
        padding: '5px 0',
    },
    link: {
        color: '#70778A',
        textDecoration: 'none',
        fontWeight: '600',
        fontSize: '16px',
        display: 'block',
    },
};
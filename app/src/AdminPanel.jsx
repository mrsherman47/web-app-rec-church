import React, { useState } from 'react';

export function AdminPanel({ events = [], onSaveEvent, onDeleteEvent, onNavigate }) {
    // 1. Состояние авторизации
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuth') === 'true';
    });
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // 2. Состояние формы редактирования/создания
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'standard', // 'standard' | 'broadcast' | 'home_group'
        description: '',
        imageUrl: '',
        date: '',
        time: '',
        location: '',
        streamUrl: '',
        homeGroups: [
            { id: 1, name: 'Домашняя группа у Василия', status: 'scheduled' },
            { id: 2, name: 'Домашняя группа в "STUDIO"', status: 'scheduled' }
        ],
        chatLinks: [
            { label: 'Чат группы Василия', url: '' },
            { label: 'Общий чат', url: '' }
        ]
    });

    // Авторизация
    const handleLogin = (e) => {
        e.preventDefault();
        // Замените на реальную проверку или запрос к серверу
        if (login === 'admin' && password === '12345') {
            setIsAuthenticated(true);
            localStorage.setItem('isAuth', 'true');
            setLoginError('');
        } else {
            setLoginError('Неверный логин или пароль');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuth');
    };

    // Заполнение формы для редактирования существующего события
    const handleStartEdit = (eventItem) => {
        setEditingId(eventItem.id);
        setFormData({
            title: eventItem.title || '',
            category: eventItem.category || 'standard',
            description: eventItem.description || '',
            imageUrl: eventItem.imageUrl || '',
            date: eventItem.date || '',
            time: eventItem.time || '',
            location: eventItem.location || '',
            streamUrl: eventItem.streamUrl || '',
            homeGroups: eventItem.homeGroups || [
                { id: 1, name: 'Домашняя группа у Василия', status: 'scheduled' },
                { id: 2, name: 'Домашняя группа в "STUDIO"', status: 'scheduled' }
            ],
            chatLinks: eventItem.chatLinks || []
        });
    };

    // Очистка формы
    const handleResetForm = () => {
        setEditingId(null);
        setFormData({
            title: '',
            category: 'standard',
            description: '',
            imageUrl: '',
            date: '',
            time: '',
            location: '',
            streamUrl: '',
            homeGroups: [
                { id: 1, name: 'Домашняя группа у Василия', status: 'scheduled' },
                { id: 2, name: 'Домашняя группа в "STUDIO"', status: 'scheduled' }
            ],
            chatLinks: []
        });
    };

    // Сохранение события
    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            id: editingId || Date.now().toString(), // Создаем ID, если это новое событие
        };
        onSaveEvent(payload);
        handleResetForm();
        alert('Событие успешно сохранено!');
    };

    // ЭКРАН 1: ФОРМА ВХОДА
    if (!isAuthenticated) {
        return (
            <div style={styles.container}>
                <button onClick={() => onNavigate('events')} style={styles.backBtn}>
                    ← На главную
                </button>
                <div style={styles.card}>
                    <h3 style={styles.title}>Вход в панель управления</h3>
                    <form onSubmit={handleLogin} style={styles.form}>
                        <input
                            type="text"
                            placeholder="Логин"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            style={styles.input}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                        {loginError && <span style={styles.errorText}>{loginError}</span>}
                        <button type="submit" style={styles.primaryBtn}>Войти</button>
                    </form>
                </div>
            </div>
        );
    }

    // ЭКРАН 2: ПАНЕЛЬ РЕДАКТИРОВАНИЯ
    return (
        <div style={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => onNavigate('events')} style={styles.backBtn}>
                    ← На сайт
                </button>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                    Выйти из системы
                </button>
            </div>

            <div style={styles.card}>
                <h3 style={styles.title}>
                    {editingId ? 'Редактирование события' : 'Создать новое событие'}
                </h3>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Тип события */}
                    <label style={styles.label}>Категория события:</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={styles.input}
                    >
                        <option value="standard">Обычное (Молитвенное, Time code, Boys brunch)</option>
                        <option value="broadcast">С трансляцией (Воскресное, Пасха, Рождество, ДР церкви)</option>
                        <option value="home_group">Домашняя группа</option>
                    </select>

                    {/* Название */}
                    <label style={styles.label}>Название события:</label>
                    <input
                        type="text"
                        placeholder="Например: Молитвенное собрание"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        style={styles.input}
                        required
                    />

                    {/* Ссылка на картинку */}
                    <label style={styles.label}>Путь к изображению:</label>
                    <input
                        type="text"
                        placeholder="src/media/ads/prayer_ru.jpg"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        style={styles.input}
                    />

                    {/* Описание */}
                    <label style={styles.label}>Описание события:</label>
                    <textarea
                        placeholder="Текст описания..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        style={{ ...styles.input, height: '80px', resize: 'vertical' }}
                    />

                    {/* Дата и время (Встроенный календарь) */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Дата (Календарь):</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={styles.label}>Время:</label>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                style={styles.input}
                            />
                        </div>
                    </div>

                    {/* Место проведения */}
                    <label style={styles.label}>Место проведения:</label>
                    <input
                        type="text"
                        placeholder="Зал 'Европа' / Главный зал"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        style={styles.input}
                    />

                    {/* Доп. поле: Трансляция (если категория broadcast) */}
                    {formData.category === 'broadcast' && (
                        <div>
                            <label style={styles.label}>Ссылка на трансляцию:</label>
                            <input
                                type="url"
                                placeholder="https://youtube.com/live/..."
                                value={formData.streamUrl}
                                onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                                style={styles.input}
                            />
                        </div>
                    )}

                    {/* Доп. блок: Статусы домашних групп (если категория home_group) */}
                    {formData.category === 'home_group' && (
                        <div style={styles.subBlock}>
                            <label style={styles.label}>Управление домашними группами:</label>
                            {formData.homeGroups.map((group, index) => (
                                <div key={group.id} style={styles.groupRowAdmin}>
                                    <span style={{ fontSize: '13px', flex: 1 }}>{group.name}</span>
                                    <select
                                        value={group.status}
                                        onChange={(e) => {
                                            const updated = [...formData.homeGroups];
                                            updated[index].status = e.target.value;
                                            setFormData({ ...formData, homeGroups: updated });
                                        }}
                                        style={styles.statusSelect}
                                    >
                                        <option value="scheduled">Запланирована</option>
                                        <option value="canceled">Отменена</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Кнопки формы */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="submit" style={{ ...styles.primaryBtn, flex: 1 }}>
                            {editingId ? 'Сохранить изменения' : 'Создать событие'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={handleResetForm} style={styles.cancelBtn}>
                                Отмена
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* СПИСОК СУЩЕСТВУЮЩИХ СОБЫТИЙ ДЛЯ УПРАВЛЕНИЯ */}
            <div style={styles.card}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Существующие события:</h4>
                {events.length === 0 ? (
                    <p style={{ fontSize: '13px', color: '#70778A' }}>Список пока пуст</p>
                ) : (
                    events.map((item) => (
                        <div key={item.id} style={styles.eventListItem}>
                            <div>
                                <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.title}</div>
                                <div style={{ fontSize: '12px', color: '#70778A' }}>
                                    {item.date} {item.time && `в ${item.time}`}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button onClick={() => handleStartEdit(item)} style={styles.actionBtn}>
                                    ✏️
                                </button>
                                <button onClick={() => onDeleteEvent(item.id)} style={styles.deleteBtn}>
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        padding: '10px',
    },
    card: {
        background: '#ffffff',
        border: '1.5px solid #d0d7de',
        borderRadius: '20px',
        padding: '16px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
    },
    title: {
        fontSize: '16px',
        fontWeight: '700',
        margin: '0 0 16px 0',
        color: '#1C1E26',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    label: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#70778A',
        marginBottom: '-4px',
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '10px',
        border: '1px solid #d0d7de',
        fontSize: '14px',
        boxSizing: 'border-box',
        outline: 'none',
    },
    subBlock: {
        background: '#F7F8FC',
        padding: '10px',
        borderRadius: '10px',
        border: '1px solid #E8EAF2',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    groupRowAdmin: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        padding: '6px 8px',
        borderRadius: '8px',
        border: '1px solid #E1E4E8',
    },
    statusSelect: {
        padding: '4px 8px',
        borderRadius: '6px',
        border: '1px solid #d0d7de',
        fontSize: '12px',
    },
    primaryBtn: {
        background: '#3390EC',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        padding: '12px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    cancelBtn: {
        background: '#E8EAF2',
        color: '#1C1E26',
        border: 'none',
        borderRadius: '10px',
        padding: '12px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: '#3390EC',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        padding: 0,
    },
    logoutBtn: {
        background: 'none',
        border: 'none',
        color: '#C62828',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    errorText: {
        color: '#C62828',
        fontSize: '12px',
    },
    eventListItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid #F0F1F5',
    },
    actionBtn: {
        background: '#F0F4FF',
        border: 'none',
        borderRadius: '6px',
        padding: '6px 10px',
        cursor: 'pointer',
    },
    deleteBtn: {
        background: '#FFEBEE',
        border: 'none',
        borderRadius: '6px',
        padding: '6px 10px',
        cursor: 'pointer',
    }
};
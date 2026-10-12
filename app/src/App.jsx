function App() {
    const [currentPage, setCurrentPage] = React.useState('home');
    const [pageParams, setPageParams] = React.useState({});
    const [eventsList, setEventsList] = React.useState([]);

    // Загрузка событий из localStorage или из JSON-файла
    React.useEffect(() => {
        const saved = localStorage.getItem('app_events');
        if (saved) {
            try {
                setEventsList(JSON.parse(saved));
                return;
            } catch (e) {
                console.error('Ошибка чтения из localStorage:', e);
            }
        }

        // Если в localStorage пусто — загружаем events_dl.json через fetch
        // Укажите точный путь к файлу относительно index.html
        fetch('src/events_dl.json')
            .then((res) => res.json())
            .then((data) => {
                const initialEvents = data.events || [];
                setEventsList(initialEvents);
                localStorage.setItem('app_events', JSON.stringify(initialEvents));
            })
            .catch((err) => console.error('Ошибка загрузки events_dl.json:', err));
    }, []);

    // Автосохранение при изменениях списка
    React.useEffect(() => {
        if (eventsList.length > 0) {
            localStorage.setItem('app_events', JSON.stringify(eventsList));
        }
    }, [eventsList]);

    const handleSaveEvent = (newEventData) => {
        setEventsList((prevEvents) => {
            const exists = prevEvents.some((item) => String(item.id) === String(newEventData.id));
            if (exists) {
                return prevEvents.map((item) =>
                    String(item.id) === String(newEventData.id) ? newEventData : item
                );
            }
            return [...prevEvents, newEventData];
        });
    };

    const handleDeleteEvent = (id) => {
        setEventsList((prevEvents) =>
            prevEvents.filter((item) => String(item.id) !== String(id))
        );
    };

    const handleNavigate = (pageKey, params = {}) => {
        setCurrentPage(pageKey);
        setPageParams(params);
        window.scrollTo(0, 0);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <Home onNavigate={handleNavigate} />;
            case 'about':
                return <About onNavigate={handleNavigate} />;
            case 'events':
                return (
                    <Events 
                        events={eventsList} 
                        onNavigate={handleNavigate} 
                    />
                );
            case 'event-details':
                return (
                    <EventDetails
                        event={pageParams.eventData}
                        eventId={pageParams.eventId}
                        onNavigate={handleNavigate}
                    />
                );
            
            case 'communication':
                return <Community onNavigate={handleNavigate} />;
            case 'ministries':
                return <Ministries onNavigate={handleNavigate} />;
            case 'team':
                return <Team onNavigate={handleNavigate} />;
            case 'baptism':
                return <Baptism onNavigate={handleNavigate} />;
            case 'admin':
                return (
                    <AdminPanel
                        events={eventsList}
                        onSaveEvent={handleSaveEvent}
                        onDeleteEvent={handleDeleteEvent}
                        onNavigate={handleNavigate}
                    />
                );
            default:
                return <Home onNavigate={handleNavigate} />;
        }
    };

    return (
        <div style={{ padding: '16px', minHeight: '100vh', background: '#f4f5f8' }}>
            {renderPage()}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
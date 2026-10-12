import React from 'react';
import { TemplateLayout } from './TemplateLayout';

// Импорт компонентов из regular
import SundayTemp1 from './regular/sunday/sunday_temp_id1';
import SundayTemp2 from './regular/sunday/sunday_temp_id2';
import SundayTemp3 from './regular/sunday/sunday_temp_id3';
import SundayTemp4 from './regular/sunday/sunday_temp_id4';
import SundayTemp5 from './regular/sunday/sunday_temp_id5';
import SundayTemp6 from './regular/sunday/sunday_temp_id6';

import HomeTemp1 from './regular/home_group/home_temp_id1';
import HomeTemp2 from './regular/home_group/home_temp_id2';
import HomeTemp3 from './regular/home_group/home_temp_id3';
import HomeTemp4 from './regular/home_group/home_temp_id4';
import HomeTemp5 from './regular/home_group/home_temp_id5';

import PrayerTemp1 from './regular/prayer/prayer_temp_id1';
import PrayerTemp2 from './regular/prayer/prayer_temp_id2';
import PrayerTemp3 from './regular/prayer/prayer_temp_id3';

import BoysTemp1 from './regular/boys_brunch/boys_temple_id1';
import BoysTemp2 from './regular/boys_brunch/boys_temple_id2';
import BoysTemp3 from './regular/boys_brunch/boys_temple_id3';

import TimeTemp1 from './regular/time_code/time_temp_id1';
import TimeTemp2 from './regular/time_code/time_temp_id2';
import TimeTemp3 from './regular/time_code/time_temp_id3';

// Импорт компонентов из not_regular
import EasterTemp1 from './not_regular/easter/easter_temp_id1';
import HbTemp1 from './not_regular/hb/hb_temp_id1';
import ChristmasTemp1 from './not_regular/christmas/christmas_temp_id1';

const TEMPLATE_MAP = {
    'sunday_temp_id1': SundayTemp1,
    'sunday_temp_id2': SundayTemp2,
    'sunday_temp_id3': SundayTemp3,
    'sunday_temp_id4': SundayTemp4,
    'sunday_temp_id5': SundayTemp5,
    'sunday_temp_id6': SundayTemp6,
    
    'home_temp_id1': HomeTemp1,
    'home_temp_id2': HomeTemp2,
    'home_temp_id3': HomeTemp3,
    'home_temp_id4': HomeTemp4,
    'home_temp_id5': HomeTemp5,

    'prayer_temp_id1': PrayerTemp1,
    'prayer_temp_id2': PrayerTemp2,
    'prayer_temp_id3': PrayerTemp3,

    'boys_temple_id1': BoysTemp1,
    'boys_temple_id2': BoysTemp2,
    'boys_temple_id3': BoysTemp3,

    'time_temp_id1': TimeTemp1,
    'time_temp_id2': TimeTemp2,
    'time_temp_id3': TimeTemp3,

    'easter_temp_id1': EasterTemp1,
    'hb_temp_id1': HbTemp1,
    'christmas_temp_id1': ChristmasTemp1
};

export function RenderEventPage({ templateId, eventData, onNavigate }) {
    const Component = TEMPLATE_MAP[templateId];

    if (!Component) {
        return <div>Шаблон не найден или не существует</div>;
    }

    return (
        <TemplateLayout onNavigate={onNavigate}>
            <Component data={eventData} onNavigate={onNavigate} />
        </TemplateLayout>
    );
}
import React, { useEffect } from 'react';
import { observable } from 'mobx';
import { persist } from 'mobx-persist';
import { observer } from 'mobx-react-lite';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import luxonPlugin from '@fullcalendar/luxon';
import rrulePlugin from '@fullcalendar/rrule';
import { getLunar } from 'holiday-kr';
import datetime from '../utils/datetime';
import { Hidden } from '@material-ui/core';
import { CreateDialog } from './createDialog';
import axios from 'axios';
import { DateTime } from 'luxon';

const data = observable({
  maxId: 0,
  events: [],
});

const schema = {
  maxId: true,
  events: {
    type: 'list',
    schema: {
      id: true,
      title: true,
      start: true,
      end: true,
      allDay: true,
      display: true,
      place: true,
    },
  },
};

const state = persist(schema)(data);
export const zerostrengthCalendar = state;

// actions
function addEvent(event) {
  state.events.push({ ...event, ...{ id: state.maxId } });
  state.maxId += 1;
}

// end of actions
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const CalendarComponent = ({ setter, calendarRef, locale, lunar, minDurationMinutes }) => {
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [defaultSettings, setDefaultSettings] = React.useState({});

  useEffect(() => {
    setter.setTitle(calendarRef.current.getApi().view.title);
    const height = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
    calendarRef.current.getApi().setOption('height', height - 85 > 700 ? 700 : height - 85);

    document.querySelector('#calendar-layout').addEventListener('touchstart', handleTouchStart);
    document.querySelector('#calendar-layout').addEventListener('touchend', handleTouchEnd);

    return () => {
      document.querySelector('#calendar-layout').removeEventListener('touchstart', handleTouchStart);
      document.querySelector('#calendar-layout').removeEventListener('touchend', handleTouchEnd);
    };
  }, [calendarRef, setter]);

  function handleGesture() {
    if (calendarRef.current) {
      const deltaX = Math.abs(touchEndX - touchStartX);
      const deltaY = Math.abs(touchEndY - touchStartY);
      if (touchEndX <= touchStartX && deltaX > deltaY * 2) {
        calendarRef.current.getApi().next();
      }
      if (touchEndX >= touchStartX && deltaX > deltaY * 2) {
        calendarRef.current.getApi().prev();
      }
    }
  }

  function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
  }

  function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].screenX;
    touchEndY = event.changedTouches[0].screenY;
    handleGesture();
  }

  function handleEventClick(clickInfo) {
    console.log(clickInfo.event.start);
    console.log(clickInfo.event.end);
    console.log(clickInfo.event.title);
  }

  function handleDateSelect(selectInfo) {
    const start = selectInfo.start.toISOString();
    const end = selectInfo.end.toISOString();
    const allDay = selectInfo.allDay;
    setDefaultSettings({ start, end, allDay });
    setCreateDialogOpen(true);
  }

  function handleDateClick(info) {
    const allDay = info.allDay;
    const start = DateTime.fromISO(info.dateStr);
    let end = '';
    // month
    if (info.view.type.includes('dayGrid') || allDay) {
      end = start.plus({ days: 1 });
    } else {
      end = start.plus({ minutes: minDurationMinutes });
    }
    setDefaultSettings({ start, end, allDay });
    setCreateDialogOpen(true);
  }

  function handleEventChange(changeInfo) {
    changeInfo.revert();
  }

  function renderEventContent(eventContent) {}

  function renderHeaderContent(content) {
    let { text } = content;
    const color = content.dow === 0 ? 'red' : 'black';

    if (content.view.type === 'dayGrid' || content.view.type === 'dayGridMonth') {
      return (
        <>
          <span style={{ color }}>{datetime.getDayName(content.dow, locale)}</span>
        </>
      );
    }
    return (
      <>
        <span style={{ color }}>{text}</span>
        <Hidden xsDown>
          <span
            style={{
              color: 'silver',
              fontSize: 'smaller',
              paddingLeft: '3px',
            }}
          >
            {lunar === 'true' && `(${getLunar(content.date).month}/${getLunar(content.date).day})`}
          </span>
        </Hidden>
        <Hidden smUp>
          <span
            style={{
              color: 'silver',
              fontSize: 'smaller',
              paddingLeft: '3px',
            }}
          >
            {lunar === 'true' && `(${getLunar(content.date).day})`}
          </span>
        </Hidden>
      </>
    );
  }

  function renderDayContent(content) {
    const color = content.dow === 0 ? 'red' : 'black';

    if (content.view.type === 'timeGridWeek' || content.view.type === 'timeGridDay') {
      return <></>;
    }
    return (
      <>
        <span style={{ color }}>{content.date.getDate()}</span>
        <Hidden xsDown>
          <span
            style={{
              color: 'silver',
              fontSize: 'smaller',
              paddingLeft: '3px',
            }}
          >
            {lunar === 'true' && `(${getLunar(content.date).month}/${getLunar(content.date).day})`}
          </span>
        </Hidden>
        <Hidden smUp>
          <span
            style={{
              color: 'silver',
              fontSize: 'smaller',
              paddingLeft: '3px',
            }}
          >
            {lunar === 'true' && `(${getLunar(content.date).day})`}
          </span>
        </Hidden>
      </>
    );
  }

  function onUpdateDates() {
    if (calendarRef && calendarRef.current) {
      setter.setTitle(calendarRef.current.getApi().view.title);
    }
  }

  function handleNavLinkDayClick(date) {
    if (calendarRef && calendarRef.current) {
      calendarRef.current.getApi().changeView('timeGrid', date);
      setter.setViewType('timeGridDay');
    }
  }

  function handleUrlImport() {
    const url = prompt('Enter iCal URL: ');
    axios.get(url).then(data => console.log(data));
  }

  function handleSelectAllow(info) {
    if (info.allDay) return true;
    let { start, end, startStr, endStr } = info;
    startStr = startStr.split('+')[0];
    endStr = endStr.split('+')[0];
    if (endStr.split('T')[1] === '00:00:00') {
      return end - start <= 1000 * 60 * 60 * 24;
    }
    return endStr.split('T')[0] === startStr.split('T')[0];
  }

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, luxonPlugin, rrulePlugin, listPlugin]}
        headerToolbar={false}
        locale={locale}
        initialView="dayGridMonth"
        nowIndicator
        titleFormat="yyyy년 {MM}월"
        buttonIcons
        firstDay={0}
        navLinks
        editable
        selectable
        selectMirror
        dayMaxEvents
        dayMaxEventRows={6}
        slotDuration={{ minutes: minDurationMinutes }}
        slotLabelInterval="01:00"
        slotEventOverlap={false}
        events={state.events.slice()}
        select={handleDateSelect}
        dateClick={handleDateClick}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        eventChange={handleEventChange}
        fixedWeekCount={false}
        datesSet={onUpdateDates}
        allDayText="종일"
        moreLinkText=""
        dayHeaderContent={renderHeaderContent}
        dayCellContent={renderDayContent}
        allDayMaintainDuration
        navLinkDayClick={handleNavLinkDayClick}
        unselectAuto={true}
        unselectCancel=".MuiDialogContent-root"
        selectAllow={handleSelectAllow}
        dragScroll={false}
      />
      <CreateDialog
        defaultSettings={defaultSettings}
        addEvent={addEvent}
        open={createDialogOpen}
        setOpen={setCreateDialogOpen}
      />
    </>
  );
};

export const Calendar = observer(CalendarComponent);

'use strict';

var util = require('util');
var sprintf = require('sprintf-js').sprintf;

function ConsoleBackend(startupTime, config, emitter) {
  var backend = this;
  this.lastFlush = startupTime;
  this.lastException = startupTime;

  emitter.on('flush', function(timestamp, metrics) {
    backend.flush(timestamp, metrics);
  });
}

ConsoleBackend.prototype.flush = function(timestamp, metrics) {
  var report = '';

  var elements = '';
  for (var count in metrics.counters) {
    if (metrics.counters.hasOwnProperty(count) && metrics.counters[count]) {
      elements += sprintf('\n%50s  %15d',  count, metrics.counters[count]);
    }
  }
  if (elements.length) {
    report += sprintf('\n\n%50s  %15s', 'counters', 'num') + elements;
  }

  // Timers.
  elements = '';
  for (var timer in metrics.timer_data) {
    if (metrics.timer_data.hasOwnProperty(timer)) {
      elements += sprintf('\n%50s  %14d  %14.0f  %14.0f  %14.0f  %14.0f',
        timer, 
        metrics.timer_data[timer].count,
        metrics.timer_data[timer].sum,
        metrics.timer_data[timer].lower,
        metrics.timer_data[timer].median,
        metrics.timer_data[timer].upper);
    }
  }
  if (elements.length) {
    report += sprintf('\n\n%50s  %14s  %14s  %14s  %14s  %14s',
        'timers', 'num', 'sum', 'lower', 'median', 'upper') + elements;
  }

  // Gauges.
  elements = '';
  for (var gauge in metrics.gauges) {
    if (metrics.gauges.hasOwnProperty(gauge)) {
      elements += sprintf('\n%50s  %14.0f', gauge, metrics.gauges[gauge]);
    }
  }
  if (elements.length) {
    report += sprintf('\n\n%50s  %14s', 'gauges', 'value') + elements;
  }

  if (report.length) {
    console.log('metrics report' + report);
  }
};

exports.init = function(startupTime, config, events) {
  return new ConsoleBackend(startupTime, config, events);
};

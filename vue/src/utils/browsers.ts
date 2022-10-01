import XRegExp from 'xregexp'

interface NavigatorUAData {
  brands: Array<{brand: string; version: string}>;
  mobile: boolean;
  platform: string;
}

type UserAgentRule = [string, string | RegExp]
type OperatingSystemRule = [string, string | RegExp]

const _isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

const _isDefined = (value: any): boolean => {
  return typeof value !== 'undefined'
}

const browsers: UserAgentRule[] = [
  ['aol', /AOLShield\/([0-9\._]+)/],
  ['edge', /Edge\/([0-9\._]+)/],
  ['edge-ios', /EdgiOS\/([0-9\._]+)/],
  ['yandexbrowser', /YaBrowser\/([0-9\._]+)/],
  ['kakaotalk', /KAKAOTALK\s([0-9\.]+)/],
  ['samsung', /SamsungBrowser\/([0-9\.]+)/],
  ['silk', /\bSilk\/([0-9._-]+)\b/],
  ['miui', /MiuiBrowser\/([0-9\.]+)$/],
  ['beaker', /BeakerBrowser\/([0-9\.]+)/],
  ['edge-chromium', /EdgA?\/([0-9\.]+)/],
  ['chromium-webview', /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
  ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
  ['phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/],
  ['crios', /CriOS\/([0-9\.]+)(:?\s|$)/],
  ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
  ['fxios', /FxiOS\/([0-9\.]+)/],
  ['opera-mini', /Opera Mini.*Version\/([0-9\.]+)/],
  ['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
  ['opera', /OPR\/([0-9\.]+)(:?\s|$)/],
  ['pie', /^Microsoft Pocket Internet Explorer\/(\d+\.\d+)$/],
  ['pie', /^Mozilla\/\d\.\d+\s\(compatible;\s(?:MSP?IE|MSInternet Explorer) (\d+\.\d+);.*Windows CE.*\)$/],
  ['netfront', /^Mozilla\/\d\.\d+.*NetFront\/(\d.\d)/],
  ['ie', /Trident\/7\.0.*rv\:([0-9\.]+)\).*Gecko$/],
  ['ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
  ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
  ['ie', /MSIE\s(7\.0)/],
  ['bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/],
  ['android', /Android\s([0-9\.]+)/],
  ['ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/],
  ['safari', /Version\/([0-9\._]+).*Safari/],
  ['facebook', /FB[AS]V\/([0-9\.]+)/],
  ['instagram', /Instagram\s([0-9\.]+)/],
  ['ios-webview', /AppleWebKit\/([0-9\.]+).*Mobile/],
  ['ios-webview', /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
  ['curl', /^curl\/([0-9\.]+)$/],
  ['searchbot', /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/],
]

const systems: OperatingSystemRule[] = [
  ['iOS', 'iPhone|iPod|iPad|iOS'],
  ['CentOS', 'CentOS'],
  ['Haiku', 'Haiku'],
  ['Debian', 'Debian'],
  ['Fedora', 'Fedora'],
  ['Free BSD', 'FreeBSD'],
  ['Fedora', 'Fedora'],
  ['Kubuntu', 'Kubuntu'],
  ['Linux Mint', 'Linux Mint'],
  ['Red Hat', 'Red Hat'],
  ['SuSE', 'SuSE'],
  ['Ubuntu', 'Ubuntu'],
  ['Xubuntu', 'Xubuntu'],
  ['Symbian OS', 'Symbian OS|SymbianOS'],
  ['Web', 'hpw|hpwOS'],
  ['webOS', 'webOS|webOS '],
  ['Tablet OS', 'Tablet OS'],
  ['Tizen', 'Tizen'],
  ['Gentoo', 'Gentoo'],
  ['Android OS', 'Android'],
  ['BlackBerry OS', 'BlackBerry|BB10'],
  ['Windows Mobile', 'IEMobile'],
  ['Amazon OS', 'Kindle'],
  ['Windows Phone', 'Windows Phone|WinPhone'],
  ['Windows 3.11', 'Win16'],
  ['Windows 95', 'Windows 95|Windows 95;|Win95|Windows_95'],
  ['Windows 98', 'Windows 98|Windows 98;|Win98'],
  ['Windows 2000', 'Windows NT 5.0|Windows 2000'],
  ['Windows XP', 'Windows NT 5.1|Windows XP'],
  ['Windows Server 2003', 'Windows NT 5.2'],
  ['Windows Vista', 'Windows NT 6.0'],
  ['Windows 7', 'Windows 7|Windows NT 6.1'],
  ['Windows 8', 'Windows 8|Windows NT 6.2'],
  ['Windows 8.1', 'Windows 8.1|Windows NT 6.3'],
  ['Windows 10', 'Windows 10|Windows NT 10.0'],
  ['Windows ME', 'Windows ME'],
  ['Windows CE', 'Windows CE|WinCE|Microsoft Pocket Internet Explorer'],
  ['Open BSD', 'OpenBSD'],
  ['Sun OS', 'SunOS'],
  ['Chrome OS', 'CrOS'],
  ['Linux', 'Linux|X11'],
  ['Mac OS', 'Mac|Mac_PowerPC|Macintosh|Mac OS X'],
  ['QNX', 'QNX'],
  ['BeOS', 'BeOS'],
  ['OS/2', /OS\/2/],
]

const mobileRegExp = _isBrowser() || _isDefined(RegExp)
  ? RegExp(
      [
        '(android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|',
        'compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|',
        'midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)',
        '\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|',
        'wap|windows ce|xda|xiino'
      ].join(''),
      'i'
    )
  : XRegExp(
    [
      '(android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|',
      'compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|',
      'midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)',
      '\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|',
      'wap|windows ce|xda|xiino'
    ].join(''),
    'i'
  )

const mobilePrefixRegExp = _isBrowser() || _isDefined(RegExp)
  ? RegExp(
      [
        '1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|',
        'ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|',
        'avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|',
        'cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|',
        'ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|',
        'g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|',
        'hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|',
        'i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|',
        'kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])',
        '|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|',
        'mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|',
        'n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|',
        'op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|',
        'po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|',
        'raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|',
        'se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|k\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|',
        'so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|',
        'tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|',
        'veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|',
        'w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-'
      ].join(''),
      'i'
    )
  : XRegExp(
    [
      '1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|',
      'ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|',
      'avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|',
      'cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|',
      'ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|',
      'g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|',
      'hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|',
      'i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|',
      'kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])',
      '|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|',
      'mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|',
      'n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|',
      'op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|',
      'po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|',
      'raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|',
      'se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|k\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|',
      'so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|',
      'tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|',
      'veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|',
      'w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-'
    ].join(''),
    'i'
  )

function getBrowser (user: string) {
  return browsers.filter((definition) => {
    const pattern = definition[1]

    let result
    if (!XRegExp.isRegExp(pattern)) {
      result = _isDefined(RegExp) ? RegExp(pattern) : XRegExp(pattern)
    } else {
      result = pattern
    }

    return result.test(user)
  }).map(([code, pattern]) => {
    const match = (pattern as RegExp).exec(user)
    const version: any = match && match[1].split(/[._]/).slice(0, 3)
    const versionTails = Array.prototype.slice.call(version, 1).join('') || '0'

    if (version && version.length < 3) {
      Array.prototype.push.apply(version, version.length === 1 ? [0, 0] : [0])
    }

    return {
      name: String(code),
      version: (version as any[]).join('.'),
      versionNumber: Number(`${version[0]}.${versionTails}`)
    }
  }).shift()
}

function getOperatingSystem (user: string) {
  return systems.map(([name, pattern]) => {
    let result
    if (!XRegExp.isRegExp(pattern)) {
      result = _isDefined(RegExp) ? RegExp(pattern) : XRegExp(pattern)
    } else {
      result = pattern
    }

    return {
      name: name,
      value: result.exec(user)
    }
  }).filter((definition) => {
    return definition.value
  }).map((definition) => {
    let os = definition.value![0] || ''

    os = os.replace(/\/(\d)/, ' $1')
    os = os.replace(/_/g, '.')
    os = os.replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, '')
    os = os.replace(/\bx86\.64\b/gi, 'x86_64')
    os = os.replace(/\b(Windows Phone) OS\b/, '$1')
    os = os.replace(/\b(Chrome OS \w+) [\d.]+\b/, '$1')
    os = os.split(' on ')[0]
    os = os.trim()
    
    os = /^(?:webOS|i(?:OS|P))/.test(os)
      ? os : (os.charAt(0).toUpperCase() + os.slice(1))
    
    return {
      name: os
    }
  }).shift()
}

function getMobile (user: string) {  
  const check = typeof user.substr !== 'function'
  const prefix = check ? user.substr(0, 4) : user.substring(0, 4)
  const mobile = mobileRegExp.test(user) || mobilePrefixRegExp.test(prefix)
  return {
    mobile: mobile
  }
}

export function getDeviceInfo () {
  let _navigator
  if (_isBrowser() && _isDefined(window.navigator)) {
    _navigator = window.navigator
  } else if (_isDefined(navigator)) {
    _navigator = navigator
  }

  if (_navigator) {
    const data = _navigator.userAgent || _navigator.vendor
    const browser = getBrowser(data)
    const mobile = getMobile(data)
    const os = getOperatingSystem(data)
    
    return {
      browser: {
        name: browser?.name
      },
      os: {
        name: os?.name
      },
      mobile: mobile.mobile
    }
  }

  return null
}

export function getUserAgentDataString(): string {
  const uaData = (navigator as any).userAgentData as
    | NavigatorUAData
    | undefined;

  if (uaData?.brands) {
    return uaData.brands
      .map((item) => `${item.brand}/${item.version}`)
      .join(' ');
  }

  return navigator.userAgent;
}


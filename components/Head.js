import NextHead from 'next/head'

export default function Head() {
    return (
        <NextHead>
            <title>Really Virtual</title>
            <link rel="icon" href="/favicon.ico" />
            <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
            <link rel="stylesheet" href="/css/app.css" />
            <link rel="stylesheet" href="/css/color-picker.min.css" />
            <script src="/js/three.js"></script>
            <script src="/js/dat.gui.js"></script>
        </NextHead>
    )
}

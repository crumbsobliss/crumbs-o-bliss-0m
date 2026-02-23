import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const token = process.env.COUNTERAPI_TOKEN || process.env.COUNTERAPI_KEY || '';

        if (!token) {
            console.warn('CounterAPI token is missing in environment variables.');
            return NextResponse.json({ success: false, error: 'Missing token' }, { status: 401 });
        }

        const url = 'https://api.counterapi.dev/v2/crumbsoblisss-team-2979/page-view-crumbsobliss/up';

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            // Ensure we don't cache this request
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error('CounterAPI Error:', await res.text());
            return NextResponse.json({ success: false, error: 'CounterAPI failed' }, { status: 502 });
        }

        const data = await res.json();
        return NextResponse.json({ success: true, count: data.count || null });
    } catch (error) {
        console.error('Tracking error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

import * as cheerio from 'cheerio';
import cloudscraper from 'cloudscraper';
import { Torrent1337xSearch, Torrent1337xDetails, Torrent1337xFile } from '../types';

const BASE_URL = 'https://1337x.to';

/**
 * Extract the last page number from search results
 */
function getLastPageNumber($: cheerio.CheerioAPI): number {
  const lastPageLink = $('li.last a').attr('href');
  if (lastPageLink) {
    const match = lastPageLink.match(/\/(\d+)(?:\/|\?.*)?$/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }
  return 1;
}

/**
 * Generate the URL for a torrent search
 */
function getQueryUrl(
  query: string,
  page: number = 1,
  category?: string | null,
  sort?: string | null,
  order: string = 'desc'
): string {
  let url: string;

  if (category && sort) {
    url = `${BASE_URL}/sort-category-search/${encodeURIComponent(query)}/${encodeURIComponent(category)}/${encodeURIComponent(sort)}/${encodeURIComponent(order)}/${page}/`;
  } else if (category) {
    url = `${BASE_URL}/category-search/${encodeURIComponent(query)}/${encodeURIComponent(category)}/${page}/`;
  } else if (sort) {
    url = `${BASE_URL}/sort-search/${encodeURIComponent(query)}/${encodeURIComponent(sort)}/${encodeURIComponent(order)}/${page}/`;
  } else {
    url = `${BASE_URL}/search/${encodeURIComponent(query)}/${page}/`;
  }
  
  return url;
}

/**
 * Search for torrents on 1337x
 */
export async function search(
  query: string,
  page: number = 1,
  category: string | null = null,
  sort: string | null = null,
  order: string = 'desc'
): Promise<Torrent1337xSearch> {
  const url = getQueryUrl(query, page, category, sort, order);
  
  try {
    const res = await cloudscraper.get(url);
    const $ = cheerio.load(res);
    const lastPage = getLastPageNumber($);

    const results = $('table > tbody > tr')
      .toArray()
      .map((el) => {
        const tds = $(el).find('td');
        const nameAndLinkEle = $(tds[0]).find('a').last();
        const name = nameAndLinkEle.text() || 'Unknown';
        const link = nameAndLinkEle.attr('href') || '';
        const seeds = $(tds[1]).text() || '0';
        const leeches = $(tds[2]).text() || '0';
        const date = $(tds[3]).text() || 'Unknown';
        const size = $(tds[4]).contents().first().text() || 'Unknown';
        
        return {
          name,
          link,
          seeds,
          leeches,
          date,
          size,
        };
      });

    return {
      results,
      pagination: {
        query,
        currentPage: parseInt(String(page)),
        lastPage,
        perPageResults: results.length,
      },
      filters: {
        category: category || 'All',
        sort: sort || 'seeders',
        order,
      },
    };
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch data: ${(error as Error).message}`);
  }
}

/**
 * Get details of a specific torrent
 */
export async function getDetails(link: string): Promise<Torrent1337xDetails> {
  const url = `${BASE_URL}${link}`;
  
  try {
    const res = await cloudscraper.get(url);
    const $ = cheerio.load(res);

    const name = $('.box-info-heading h1').text().trim() || 'Unknown';
    const magnet = $('a[href^="magnet:"]').first().attr('href') || 'Not available';
    const category = $('ul.list li:contains("Category") span')
      .not('.seeds, .leeches')
      .text()
      .trim() || 'Unknown';
    const type = $('ul.list li:contains("Type") span')
      .not('.seeds, .leeches')
      .text()
      .trim() || 'Unknown';
    const language = $('ul.list li:contains("Language") span')
      .not('.seeds, .leeches')
      .text()
      .trim() || 'Unknown';
    const uploadDate = $('ul.list li:contains("Date uploaded") span')
      .not('.seeds, .leeches')
      .text()
      .trim() || 'Unknown';
    const size = $('ul.list li:contains("Total size") span')
      .not('.seeds, .leeches')
      .text()
      .trim() || 'Unknown';
    const seeds = $('ul.list .seeds').text().trim() || '0';
    const leeches = $('ul.list .leeches').text().trim() || '0';
    const uploader = $('ul.list li:contains("Uploaded By") a').text().trim() || 'Unknown';

    const files = $('#files.file-content ul li')
      .map((i, el) => {
        const $li = $(el);
        $li.find('i').remove();
        const text = $li.text().trim();
        const lastParenIndex = text.lastIndexOf(' (');
        if (lastParenIndex === -1) return null;
        const name = text.substring(0, lastParenIndex).trim();
        const size = text.substring(lastParenIndex + 2, text.length - 1).trim();
        return {
          name,
          size,
        };
      })
      .get()
      .filter((file): file is Torrent1337xFile => file !== null);

    return {
      name,
      magnet,
      category,
      uploadDate,
      size,
      language,
      type,
      seeds,
      leeches,
      uploader,
      files,
    };
  } catch (error) {
    throw new Error(`Failed to fetch torrent details: ${(error as Error).message}`);
  }
}
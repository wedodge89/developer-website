import React, { Fragment, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import cx from 'classnames';
import { BreadcrumbContext } from './BreadcrumbContext';
import FeatherIcon from './FeatherIcon';
import pages from '../data/sidenav.json';

import styles from './Navigation.module.scss';

// TODO: Add this implementation
const filterPages = (pages, _searchTerm) => pages;

// recursively create navigation
const renderNav = (pages, depthLevel = 0) => {
  const crumbs = useContext(BreadcrumbContext).flatMap((x) => x.displayName);

  const groupedPages = pages.reduce((groups, page) => {
    const { group = '' } = page;

    return {
      ...groups,
      [group]: [...(groups[group] || []), page],
    };
  }, {});

  return Object.entries(groupedPages).map(([group, pages]) => (
    <Fragment key={group}>
      {group && (
        <li className={cx(styles.navLink, styles.groupName)}>{group}</li>
      )}
      {pages.map((page) => {
        const [isExpanded, setIsExpanded] = useState(
          crumbs.length === depthLevel || crumbs.includes(page.displayName)
        );
        const isCurrentPage = crumbs[crumbs.length - 1] === page.displayName;

        return (
          <li
            key={page.displayName}
            data-depth={depthLevel}
            className={cx({ [styles.isCurrentPage]: isCurrentPage })}
          >
            {page.url ? (
              <Link className={styles.navLink} to={page.url}>
                {page.displayName}
                {isCurrentPage && (
                  <FeatherIcon
                    className={styles.currentPageIndicator}
                    name="chevron-right"
                  />
                )}
              </Link>
            ) : (
              <button
                type="button"
                className={styles.navLink}
                onClick={() => setIsExpanded(!isExpanded)}
                onKeyPress={() => setIsExpanded(!isExpanded)}
                tabIndex={0}
              >
                {page.displayName}
              </button>
            )}
            {page.children && (
              <ul
                className={cx(styles.nestedNav, {
                  [styles.isExpanded]: isExpanded,
                })}
              >
                {renderNav(page.children, depthLevel + 1)}
              </ul>
            )}
          </li>
        );
      })}
    </Fragment>
  ));
};

const Navigation = ({ className, searchTerm }) => {
  const filteredPages = searchTerm ? filterPages(pages, searchTerm) : pages;

  return (
    <nav
      className={cx(styles.container, className)}
      role="navigation"
      aria-label="Navigation"
    >
      <ul className={styles.listNav}>{renderNav(filteredPages)}</ul>
    </nav>
  );
};

Navigation.propTypes = {
  className: PropTypes.string,
  searchTerm: PropTypes.string,
};

export default Navigation;

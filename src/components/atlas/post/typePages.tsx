import React from 'react'
import PageType from './PageType'
import type { PageTypeProps } from './types'

export const EssayPage: React.FC<PageTypeProps> = (props) => <PageType {...props} />
export const FieldNotePage: React.FC<PageTypeProps> = (props) => <PageType {...props} />
export const GuidepostPage: React.FC<PageTypeProps> = (props) => <PageType {...props} />
export const ProjectPage: React.FC<PageTypeProps> = (props) => <PageType {...props} />
export const TalkPage: React.FC<PageTypeProps> = (props) => <PageType {...props} />
export const PodcastPage: React.FC<PageTypeProps> = (props) => <PageType {...props} />
export const LogPage: React.FC<PageTypeProps> = (props) => <PageType {...props} />
export const FragmentPage: React.FC<PageTypeProps> = (props) => <PageType {...props} />
export const MapPage: React.FC<PageTypeProps> = (props) => <PageType {...props} />

export default PageType


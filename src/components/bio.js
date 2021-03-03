/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author

  const avatar = data?.avatar?.childImageSharp?.fixed

  return (
    <div className="bio">
      {avatar && (
        <StaticImage
          className="bio-avatar"
          layout="fixed"
          formats={["AUTO", "WEBP", "AVIF"]}
          src="../../content/assets/profile-pic.jpg"
          width={50}
          height={50}
          quality={95}
          alt="Profile picture"
        />
      )}
      {author?.name && (
        <p>
          Written by
          <a href="https://github.com/ilcm96"> Yun Seongmin</a>
        </p>
      )}
    </div>
  )
}

export default Bio
